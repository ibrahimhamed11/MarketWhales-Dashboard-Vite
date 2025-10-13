import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Box,
  Grid,
  GridItem,
  Text,
  Progress,
  VStack,
  useColorModeValue,
  Alert,
  AlertIcon,
  Spinner,
  Button
} from '@chakra-ui/react';
import VideoList from '../../components/mux/VideoList';
import MuxPlayer from '../../components/MuxPlayer';
import ErrorBoundary from '../../components/ErrorBoundary';

const CoursePage = () => {
  const { courseId } = useParams();
  const history = useHistory();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchProgress, setWatchProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found, redirecting to login');
      history.push('/auth/sign-in');
      return;
    }

    // Validate courseId
    if (!courseId) {
      setError('No course ID provided');
      setLoading(false);
      return;
    }

    // Set loading to false after initial checks
    setLoading(false);
  }, [courseId, history]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleProgress = (currentTime, duration, progress) => {
    setWatchProgress(prev => ({
      ...prev,
      [selectedVideo._id]: {
        currentTime,
        duration,
        progress
      }
    }));
  };

  const handleComplete = (duration) => {
    console.log('Video completed:', selectedVideo.title);
    setWatchProgress(prev => ({
      ...prev,
      [selectedVideo._id]: {
        currentTime: duration,
        duration,
        progress: 100,
        completed: true
      }
    }));
  };

  if (loading) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ xs: 1, sm: 1 }}>
        <VStack spacing={4} justify="center" minH="400px">
          <Spinner size="xl" />
          <Text>Loading course...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ xs: 1, sm: 1 }}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
        <Button onClick={() => history.push('/admin')} colorScheme="blue">
          Go Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ xs: 1, sm: 1 }}>
        <VStack spacing={4} align="stretch">
          <Box>
            <Button 
              onClick={() => history.push('/admin')} 
              variant="outline" 
              size="sm"
              mb={4}
            >
              ← Back to Dashboard
            </Button>
            <Text fontSize="2xl" fontWeight="bold" mb={6}>
              Course Videos
            </Text>
          </Box>
        
        <Grid templateColumns={{ base: "1fr", lg: "350px 1fr" }} gap={6}>
          <GridItem>
            <Box 
              bg={bgColor} 
              p={4} 
              borderRadius="lg" 
              border="1px solid" 
              borderColor={borderColor}
              h="fit-content"
            >
              <VideoList 
                courseId={courseId}
                isAdmin={false}
                onVideoSelect={handleVideoSelect}
              />
            </Box>
          </GridItem>
          
          <GridItem>
            <Box 
              bg={bgColor} 
              p={6} 
              borderRadius="lg" 
              border="1px solid" 
              borderColor={borderColor}
            >
              {selectedVideo ? (
                <VStack spacing={4} align="stretch">
                  <Text fontSize="lg" fontWeight="bold">
                    {selectedVideo.title}
                  </Text>
                  <MuxPlayer 
                    videoId={selectedVideo._id}
                    onProgress={handleProgress}
                    onComplete={handleComplete}
                    onError={(err) => {
                      console.error('Video playback error:', err);
                      setError('Video playback failed. Please try again or contact support.');
                    }}
                  />
                  
                  {selectedVideo && watchProgress[selectedVideo._id] && (
                    <Box>
                      <Text fontSize="sm" mb={2}>
                        Progress: {Math.round(watchProgress[selectedVideo._id].progress)}%
                      </Text>
                      <Progress 
                        value={watchProgress[selectedVideo._id].progress} 
                        colorScheme="blue"
                        size="sm"
                        borderRadius="md"
                      />
                    </Box>
                  )}
                </VStack>
              ) : (
                <VStack spacing={4} justify="center" minH="400px">
                  <Text fontSize="6xl">📹</Text>
                  <Text fontSize="lg" color="gray.500">
                    Select a video to start watching
                  </Text>
                </VStack>
              )}
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
    </ErrorBoundary>
  );
};

export default CoursePage;
