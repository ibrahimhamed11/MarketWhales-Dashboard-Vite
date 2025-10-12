import { Box } from "@chakra-ui/react";
import SuperVisors from './components/SuperVisors';

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SuperVisors />
    </Box>
  );
}
