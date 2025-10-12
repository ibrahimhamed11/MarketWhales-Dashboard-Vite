import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import VideoUpload from '../../components/mux/VideoUpload';
import VideoList from '../../components/mux/VideoList';
import MuxPlayer from '../../components/MuxPlayer';

const AdminVideos = () => {
  const { courseId } = useParams();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [refreshList, setRefreshList] = useState(0);

  const bgColor = useColorModeValue('white', 'gray.800');

  const handleUploadComplete = (video) => {
    console.log('Upload completed:', video);
    setRefreshList(prev => prev + 1); // Trigger video list refresh
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Box bg={bgColor} p={6} borderRadius="lg" shadow="sm">
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Video Management Dashboard
        </Text>
        
        <Tabs colorScheme="blue">
          <TabList>
            <Tab>Upload Videos</Tab>
            <Tab>Manage Videos</Tab>
            {selectedVideo && <Tab>Preview</Tab>}
          </TabList>

          <TabPanels>
            <TabPanel>
              <VideoUpload 
                courseId={courseId}
                onUploadComplete={handleUploadComplete}
              />
            </TabPanel>
            
            <TabPanel>
              <VideoList 
                courseId={courseId}
                isAdmin={true}
                onVideoSelect={handleVideoSelect}
                key={refreshList} // Force refresh
              />
            </TabPanel>
            
            {selectedVideo && (
              <TabPanel>
                <Box>
                  <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Preview: {selectedVideo.title}
                  </Text>
                  <MuxPlayer videoId={selectedVideo._id} />
                </Box>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default AdminVideos;
