import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  Badge,
  Alert,
  AlertIcon,
  Spinner,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody
} from '@chakra-ui/react';
import { MdPlayArrow, MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import { videoService } from '../../apis/mux/videoApi';
import Card from '../card/Card';
import AdminVideoPreview from '../admin/AdminVideoPreview';

const VideoList = ({ courseId, isAdmin = false, onVideoSelect }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewVideoId, setPreviewVideoId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadVideos();
  }, [courseId]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const videoList = isAdmin 
        ? await videoService.getCourseVideos(courseId)
        : await videoService.getUserCourseVideos(courseId);
      
      setVideos(videoList);
      setLoading(false);
    } catch (err) {
      setError('Failed to load videos');
      setLoading(false);
    }
  };

  const handleVideoUpdate = async (videoId, updates) => {
    try {
      await videoService.updateVideo(videoId, updates);
      loadVideos(); // Refresh list
      toast({
        title: 'Video Updated',
        description: 'Video has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update video.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleVideoDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      await videoService.deleteVideo(videoId);
      loadVideos(); // Refresh list
      toast({
        title: 'Video Deleted',
        description: 'Video has been deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete video.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePreview = (video) => {
    setPreviewVideoId(video._id);
  };

  const closePreview = () => {
    setPreviewVideoId(null);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <VStack spacing={4} p={8} justify="center">
        <Spinner size="xl" />
        <Text>Loading videos...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Course Videos ({videos.length})
      </Text>
      
      {videos.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No videos found for this course.
        </Alert>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {videos.map((video) => (
            <Card key={video._id} overflow="hidden">
              <Box position="relative">
                {video.thumbnailUrl ? (
                  <Image 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    h="200px"
                    w="100%"
                    objectFit="cover"
                  />
                ) : (
                  <Box 
                    h="200px" 
                    bg="gray.200" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                  >
                    <Text fontSize="4xl">📹</Text>
                  </Box>
                )}
                
                <IconButton
                  icon={<MdPlayArrow />}
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  colorScheme="blue"
                  isRound
                  size="lg"
                  onClick={() => onVideoSelect?.(video)}
                />
              </Box>
              
              <Box p="20px">
                <VStack align="start" spacing={3}>
                  <Text fontWeight="bold" fontSize="lg">{video.title}</Text>
                  
                  {video.description && (
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {video.description}
                    </Text>
                  )}
                  
                  <HStack spacing={2} flexWrap="wrap">
                    {video.duration && (
                      <Badge colorScheme="blue">
                        {formatDuration(video.duration)}
                      </Badge>
                    )}
                    
                    <Badge colorScheme={video.muxStatus === 'ready' ? 'green' : 'yellow'}>
                      {video.muxStatus || 'ready'}
                    </Badge>
                    
                    {video.videoProvider && (
                      <Badge colorScheme="purple">
                        {video.videoProvider}
                      </Badge>
                    )}
                  </HStack>
                  
                  <HStack spacing={2}>
                    {isAdmin ? (
                      <>
                        <Button 
                          onClick={() => handlePreview(video)}
                          colorScheme="blue"
                          size="sm"
                          leftIcon={<MdVisibility />}
                        >
                          Preview
                        </Button>
                        <IconButton
                          icon={<MdEdit />}
                          onClick={() => {
                            const newTitle = prompt('New title:', video.title);
                            if (newTitle) {
                              handleVideoUpdate(video._id, { title: newTitle });
                            }
                          }}
                          colorScheme="gray"
                          size="sm"
                          aria-label="Edit video"
                        />
                        <IconButton
                          icon={<MdDelete />}
                          onClick={() => handleVideoDelete(video._id)}
                          colorScheme="red"
                          size="sm"
                          aria-label="Delete video"
                        />
                      </>
                    ) : (
                      <Button 
                        onClick={() => onVideoSelect?.(video)}
                        colorScheme="blue"
                        size="sm"
                        leftIcon={<MdPlayArrow />}
                      >
                        Watch
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      )}
      
      {/* Preview Modal */}
      <Modal isOpen={!!previewVideoId} onClose={closePreview} size="6xl">
        <ModalOverlay bg="rgba(0, 0, 0, 0.7)" />
        <ModalContent bg="transparent" boxShadow="none" maxW="90vw" maxH="90vh">
          <ModalBody p={0}>
            {previewVideoId && (
              <AdminVideoPreview 
                videoId={previewVideoId}
                onClose={closePreview}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default VideoList;
