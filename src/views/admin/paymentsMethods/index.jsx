import { Box } from "@chakra-ui/react";
import PaymentsMethods from './components/paymentsMethods';

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <PaymentsMethods />
    </Box>
  );
}
