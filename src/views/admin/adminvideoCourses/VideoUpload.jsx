import { Box, Container } from "@chakra-ui/react";
import VideoUploadForm from './components/VideoUploadForm';

export default function VideoUpload() {
  return (
    <Box 
      w="100%"
      pt={{ base: "140px", md: "100px", xl: "100px" }}
      px={{ base: 3, sm: 4, md: 6 }}
      minH="100vh"
      bg="#f5f5f5"
    >
      <Container 
        maxW="1400px"
        centerContent
      >
        <Box
          w="100%"
          display="flex"
          flexDirection="column"
          gap={4}
          pt={{ base: 4, md: 5 }}
          pb={6}
        >
          <VideoUploadForm />
        </Box>
      </Container>
    </Box>
  );
}
