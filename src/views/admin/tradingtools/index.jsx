import { Box } from "@chakra-ui/react";
import TradingtoolsTable from './components/tradingtools';

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <TradingtoolsTable/>

      
    </Box>
  );
}
