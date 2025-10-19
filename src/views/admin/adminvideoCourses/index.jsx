import { Box, Container } from "@chakra-ui/react";
import CourseManagementDashboard from './CourseManagementDashboard';

export default function VideoCoursesManagement() {
  return (
    <Box pt={{ xs: "130px", md: "80px", xl: "80px" }} px={{ xs: 1, sm: 1 }}>
      <CourseManagementDashboard />
    </Box>
  );
}
