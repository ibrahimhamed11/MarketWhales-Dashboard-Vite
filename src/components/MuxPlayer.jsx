import React, { useState, useEffect } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { 
  Box, 
  IconButton, 
  Alert, 
  AlertIcon,
  Spinner, 
  Text, 
  Modal, 
  ModalOverlay, 
  ModalContent,
  ModalCloseButton
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import videoService from '../apis/mux/videoApi';
import { generateDeviceFingerprint } from '../utils/courses/videoUtils';

// Single, clean Mux player component with new screen option
const MuxPlayerComponent = ({ 
  videoId, 
  onProgress, 
  onError,
  onEnded,
  autoPlay = false, 
  style = {},
  showNewScreenButton = true,
  ...props 
}) => {
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewScreen, setIsNewScreen] = useState(false);

  useEffect(() => {
    if (videoId) {
      loadVideoStream();
    }
  }, [videoId]);

  const loadVideoStream = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading video stream for videoId:', videoId);
      
      // Try Mux admin stream first, fallback to user stream
      let data;
      try {
        data = await videoService.getAdminVideoStream(videoId);
        console.log('Admin stream data:', data);
      } catch (adminError) {
        console.log('Admin stream failed, trying user stream:', adminError);
        const deviceFingerprint = generateDeviceFingerprint();
        data = await videoService.getVideoStreamUrl(videoId, deviceFingerprint);
        console.log('User stream data:', data);
      }
      
      setStreamData(data);
    } catch (err) {
      console.error('Error loading video stream:', err);
      setError(err.message || 'Failed to load video');
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProgress = (event) => {
    if (onProgress) {
      onProgress({
        currentTime: event.target.currentTime,
        duration: event.target.duration,
        played: event.target.currentTime / event.target.duration
      });
    }
  };

  const handleEnded = () => {
    onEnded?.();
  };

  const openInNewScreen = () => {
    setIsNewScreen(true);
  };

  const closeNewScreen = () => {
    setIsNewScreen(false);
  };

  const PlayerComponent = ({ inModal = false }) => (
    <Box position="relative" sx={inModal ? {} : style}>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Spinner size="lg" />
          <Text ml={3}>Loading video...</Text>
        </Box>
      )}
      
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      
      {streamData && !loading && (
        <>
          <MuxPlayer
            playbackId={streamData.playbackId}
            streamType={streamData.streamType || 'on-demand'}
            autoPlay={autoPlay}
            onProgress={handleProgress}
            onEnded={handleEnded}
            style={{
              width: '100%',
              height: 'auto',
              minHeight: inModal ? '70vh' : '300px',
            }}
            {...props}
          />
          
          {/* Control buttons */}
          {showNewScreenButton && !inModal && (
            <Box
              position="absolute"
              top={2}
              right={2}
              bg="rgba(0, 0, 0, 0.6)"
              borderRadius="md"
              p={1}
            >
              <IconButton
                size="sm"
                onClick={openInNewScreen}
                color="white"
                bg="transparent"
                _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
                title="Open in new screen"
                icon={<ExternalLinkIcon />}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );

  return (
    <>
      {/* Main player */}
      <PlayerComponent />
      
      {/* New screen modal */}
      <Modal isOpen={isNewScreen} onClose={closeNewScreen} size="full">
        <ModalOverlay />
        <ModalContent 
          bg="black" 
          m={4}
          borderRadius="lg"
          overflow="hidden"
        >
          <ModalCloseButton color="white" zIndex={1000} />
          <PlayerComponent inModal={true} />
        </ModalContent>
      </Modal>
    </>
  );
};

export default MuxPlayerComponent;
