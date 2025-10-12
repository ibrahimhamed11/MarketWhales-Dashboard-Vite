import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
  ThemeProvider,
  Container
} from '@mui/material';

// Chakra UI imports
import {
  SimpleGrid,
  Icon,
  useColorModeValue,
  Flex
} from "@chakra-ui/react";

// Import Chakra components
import MiniStatistics from '../../components/card/MiniStatistics';
import IconBox from '../../components/icons/IconBox';

// Icons
import {
  VideoLibrary as VideoLibraryIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

// React Icons for Chakra UI cards
import { MdClass, MdSchool, MdVideoLibrary, MdOndemandVideo } from "react-icons/md";

import useCoursesManagement from '../../hooks/useCoursesManagement';
import muiTheme from '../../theme/muiTheme';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Utility function to detect Arabic text
const hasArabic = (text) => {
  if (!text) return false;
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicRegex.test(text);
};

// Get appropriate font family
const getFontFamily = (text) => {
  return hasArabic(text) ? 'Droid' : 'inherit';
};

const CourseManagementDashboard = () => {
  const history = useHistory();
  const {
    filteredCourses,
    stats,
    loading,
    error,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    refetch
  } = useCoursesManagement();

  const handleCourseSelect = (course) => {
    // Navigate to the dedicated course videos management page
    history.push(`/admin/course-videos/${course._id}`);
  };

  // Chakra theming helpers
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  if (loading) {
    return (
      <ThemeProvider theme={muiTheme}>
        <Container maxWidth="xl" sx={{ pt: { base: "130px", md: "80px", xl: "80px" } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            flexDirection: 'column'
          }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ fontFamily: getFontFamily('Loading courses...') }}>Loading courses...</Typography>
            <Box sx={{ mt: 2, width: '300px' }}>
              <LinearProgress />
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={muiTheme}>
        <Container maxWidth="xl" sx={{ pt: { base: "130px", md: "80px", xl: "80px" } }}>
      <Alert 
            severity="error" 
            action={
        <Button color="inherit" size="small" onClick={refetch}>
                Try Again
              </Button>
            }
          >
            {error}
          </Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <Container maxWidth="xl" sx={{ pt: { base: "130px", md: "80px", xl: "80px" } }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ 
                mb: 1, 
                fontWeight: 700, 
                color: 'primary.main', 
                fontFamily: getFontFamily('Course Management Dashboard')
              }}>
                Course Management Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ 
                fontSize: '1rem', 
                fontFamily: getFontFamily('Manage your courses, upload videos, and track performance analytics')
              }}>
                Manage your courses, upload videos, and track performance analytics
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              sx={{ 
                borderRadius: 3, 
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600
              }}
              onClick={() => history.push('/admin/courses')}
            >
              Create New Course
            </Button>
          </Box>

          {/* Statistics Cards */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3, "2xl": 4 }}
            gap="20px"
            mb="20px"
          >
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={MdSchool} color={brandColor} />}
                />
              }
              name="Total Courses"
              value={stats.totalCourses}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={MdClass} color={brandColor} />}
                />
              }
              name="Paid Courses"
              value={stats.paidCourses}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={MdVideoLibrary} color={brandColor} />}
                />
              }
              name="Free Courses"
              value={stats.freeCourses}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={MdOndemandVideo} color={brandColor} />}
                />
              }
              name="Total Videos"
              value={stats.totalVideos}
            />
          </SimpleGrid>
        </Box>

        {/* Courses Section */}
        <Box sx={{ mb: 4 }}>
          {/* Course Filters */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="body1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', fontFamily: getFontFamily(`All Courses (${filteredCourses.length})`) }}>
              <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
              All Courses ({filteredCourses.length})
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ minWidth: 250 }}
              />
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Course Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Course Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="paid">Paid Only</MenuItem>
                  <MenuItem value="free">Free Only</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" sx={{ mb: 2, fontFamily: getFontFamily(courseSearchQuery ? 'No courses match your search' : 'No courses available') }}>
                {courseSearchQuery ? 'No courses match your search' : 'No courses available'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontFamily: getFontFamily(courseSearchQuery ? 'Try adjusting your search terms' : 'Create your first course to get started') }}>
                {courseSearchQuery ? 'Try adjusting your search terms' : 'Create your first course to get started'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => history.push('/admin/courses')}
                size="large"
              >
                Create Course
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredCourses.map(course => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 4,
                        borderColor: 'primary.main'
                      }
                    }}
                    onClick={() => handleCourseSelect(course)}
                  >
                      <CardMedia
                        sx={{ 
                          height: 160,
                          position: 'relative',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}
                      >
                        {course.image ? (
                          <img 
                            src={`${API_URL}${course.image}`} 
                            alt={course.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              position: 'absolute',
                              top: 0,
                              left: 0
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = e.target.parentElement.querySelector('.course-icon-fallback');
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        
                        <Box 
                          className="course-icon-fallback"
                          sx={{
                            display: course.image ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%'
                          }}
                        >
                          <SchoolIcon sx={{ fontSize: 60, color: 'white', opacity: 0.8 }} />
                        </Box>
                        
                        <Box sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          display: 'flex',
                          gap: 1
                        }}>
                          <Chip
                            label={course.type}
                            size="small"
                            sx={{ 
                              bgcolor: course.type === 'Paid' ? 'success.main' : 'info.main',
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>

                        {course.price && course.type === 'Paid' && (
                          <Box sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2" fontWeight={600} sx={{ fontFamily: getFontFamily(course.price) }}>
                              {course.price}
                            </Typography>
                          </Box>
                        )}
                      </CardMedia>
                      
                      <CardContent sx={{ pb: 1 }}>
                        <Typography variant="body1" sx={{ 
                          fontWeight: 600, 
                          mb: 1,
                          fontFamily: getFontFamily(course.name),
                          wordWrap: 'break-word',
                          overflow: 'visible'
                        }}>
                          {course.name}
                        </Typography>
                        
                        {course.courseType && (
                          <Chip 
                            label={course.courseType} 
                            size="small" 
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                        )}
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GroupIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: getFontFamily(`${course.totalSalesCount || 0} students`) }}>
                              {course.totalSalesCount || 0} students
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <VideoLibraryIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
                            <Typography variant="caption" color="primary.main" fontWeight={600} sx={{ fontFamily: getFontFamily(course.type) }}>
                              {course.type}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      
                      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                        <Button 
                          size="small" 
                          startIcon={<VideoLibraryIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseSelect(course);
                          }}
                          variant="outlined"
                          sx={{ mr: 1 }}
                        >
                          Manage Videos
                        </Button>
                        <Button 
                          size="small" 
                          startIcon={<UploadIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            history.push(`/admin/upload-video/${course._id}`);
                          }}
                          color="primary"
                        >
                          Upload Video
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          )}
        </Box>

      </Container>
    </ThemeProvider>
  );
};

export default CourseManagementDashboard;
