import { Box } from "@chakra-ui/react";
import CompetitionsTable from './components/CompetitionsTable';

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <CompetitionsTable/>

      
    </Box>
  );
}
