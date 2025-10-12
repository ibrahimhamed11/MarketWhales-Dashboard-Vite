import { Box } from "@chakra-ui/react";
import CashbackTable from './components/cashback';

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <CashbackTable />
    </Box>
  );
}
