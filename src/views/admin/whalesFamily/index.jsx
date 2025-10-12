import { Box } from "@chakra-ui/react";
import WhalesRequsts from './components/whalesRequsts';

export default function Overview() {
  return (
    <Box pt={{ xs: "130px", md: "80px", xl: "80px" }} px={{ xs: 1, sm: 1 }}>
      <WhalesRequsts />
    </Box>
  );
}
