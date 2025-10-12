import { Box } from "@chakra-ui/react";
import Signals from './components/signals';

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Signals />
    </Box>
  );
}
