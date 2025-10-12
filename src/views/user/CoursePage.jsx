import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  GridItem,
  Text,
  Progress,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import VideoList from '../../components/mux/VideoList';
import MuxPlayer from '../../components/MuxPlayer';

const CoursePage = () => {
  const { courseId } = useParams();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchProgress, setWatchProgress] = useState({});

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

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

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ xs: 1, sm: 1 }}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Course Videos
      </Text>
      
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
                <MuxPlayer 
                  videoId={selectedVideo._id}
                  onProgress={handleProgress}
                  onComplete={handleComplete}
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
    </Box>
  );
};

export default CoursePage;
