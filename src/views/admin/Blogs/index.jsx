import { Box } from "@chakra-ui/react";
import BlogsTable from './components/BlogsTable';

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <BlogsTable />
    </Box>
  );
}
