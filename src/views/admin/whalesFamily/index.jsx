import { Box } from "@chakra-ui/react";
import WhalesRequsts from './components/whalesRequsts';

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <WhalesRequsts />
    </Box>
  );
}
