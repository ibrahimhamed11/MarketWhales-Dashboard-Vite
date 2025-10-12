import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import CourseManagementDashboard from '../CourseManagementDashboard';

export default function VideoCoursesManagement() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
  <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Course Management</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel px={0}>
            <CourseManagementDashboard />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
