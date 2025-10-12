import { Box } from "@chakra-ui/react";
import Logger from './components/logger';

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Logger />
    </Box>
  );
}
