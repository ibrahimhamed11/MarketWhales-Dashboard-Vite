import { Box } from "@chakra-ui/react";
import UserDataTable from './components/userDataTable';

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <UserDataTable />
    </Box>
  );
}
