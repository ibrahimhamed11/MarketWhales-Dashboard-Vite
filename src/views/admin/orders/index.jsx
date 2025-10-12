import { Box } from "@chakra-ui/react";
import OrdersTable from './components/orders';

export default function Overview() {
  return (
    <Box >
      <OrdersTable />
    </Box>
  );
}
