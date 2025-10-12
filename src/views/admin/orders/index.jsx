import { Box } from "@chakra-ui/react";
import OrdersTable from './components/orders';

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <OrdersTable />
    </Box>
  );
}
