import { Box } from "@chakra-ui/react";
import VideoUploadForm from './components/VideoUploadForm';

export default function VideoUpload() {
  return (
    <Box pt={{ xs: "130px", md: "80px", xl: "80px" }} px={{ xs: 1, sm: 1 }}>
      <VideoUploadForm />
    </Box>
  );
}
