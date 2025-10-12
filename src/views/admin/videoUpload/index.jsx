import { Box } from "@chakra-ui/react";
import VideoUploadForm from './components/VideoUploadForm';

export default function VideoUpload() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <VideoUploadForm />
    </Box>
  );
}
