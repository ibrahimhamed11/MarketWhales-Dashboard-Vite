import { Box } from "@chakra-ui/react";
import AnnouncementTable from './components/announcementTable';

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <AnnouncementTable/>

      
    </Box>
  );
}
