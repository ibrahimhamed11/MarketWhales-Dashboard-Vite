import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Grid,
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
  ThemeProvider,
  Container,
  Paper
} from '@mui/material';

// Chakra UI imports
import {
  SimpleGrid,
  Icon,
  useColorModeValue
} from "@chakra-ui/react";

// Import Chakra components
import MiniStatistics from '../../../components/card/MiniStatistics';
import IconBox from '../../../components/icons/IconBox';

// Import shared components
import {
  LoadingState,
  ErrorState,
  EmptyState
} from '../../../components/shared';

// Icons
import {
  VideoLibrary as VideoLibraryIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  Add as AddIcon,
  AttachMoney as AttachMoneyIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';

// React Icons for Chakra UI cards
import { MdClass, MdSchool, MdVideoLibrary, MdOndemandVideo } from "react-icons/md";

// Hooks and utilities
import useCoursesManagement from '../../../hooks/useCoursesManagement';
import muiTheme from '../../../theme/muiTheme';
import { API_URL } from '../../../apis/config';
import { getFontFamily } from '../../../utils/textUtils';

// Import styles
import * as styles from './CourseManagementDashboard.styles';

const CourseManagementDashboard = () => {
  const history = useHistory();
  const { t } = useTranslation();
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
        <Container maxWidth="xl" sx={styles.containerStyles}>
          <LoadingState message={t('courseManagement.loadingCourses')} />
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={muiTheme}>
        <Container maxWidth="xl" sx={styles.containerStyles}>
          <ErrorState 
            message={error} 
            onRetry={refetch}
            retryText={t('courseManagement.tryAgain')}
          />
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <Container maxWidth="xl" sx={styles.containerStyles}>
        
        {/* Header Section */}
        <Box sx={styles.headerBoxStyles}>
          <Box sx={styles.headerFlexStyles}>
            <Box sx={styles.headerTitleBoxStyles}>
              <Typography 
                variant="h5" 
                sx={{ 
                  ...styles.titleStyles,
                  fontFamily: getFontFamily(t('courseManagement.title'))
                }}
              >
                {t('courseManagement.title')}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  ...styles.subtitleStyles,
                  fontFamily: getFontFamily(t('courseManagement.subtitle'))
                }}
              >
                {t('courseManagement.subtitle')}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              sx={styles.createButtonStyles}
              onClick={() => history.push('/admin/courses')}
            >
              {t('courseManagement.createNewCourse')}
            </Button>
          </Box>

          {/* Statistics Cards */}
          <SimpleGrid
            columns={styles.statisticsGridStyles.columns}
            gap={styles.statisticsGridStyles.gap}
            mb={styles.statisticsGridStyles.mb}
          >
            <MiniStatistics
              startContent={
                <IconBox
                  w={styles.iconBoxStyles.w}
                  h={styles.iconBoxStyles.h}
                  bg={boxBg}
                  icon={<Icon w={styles.iconStyles.w} h={styles.iconStyles.h} as={MdSchool} color={brandColor} />}
                />
              }
              name={t('courseManagement.totalCourses')}
              value={stats.totalCourses}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w={styles.iconBoxStyles.w}
                  h={styles.iconBoxStyles.h}
                  bg={boxBg}
                  icon={<Icon w={styles.iconStyles.w} h={styles.iconStyles.h} as={MdClass} color={brandColor} />}
                />
              }
              name={t('courseManagement.paidCourses')}
              value={stats.paidCourses}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w={styles.iconBoxStyles.w}
                  h={styles.iconBoxStyles.h}
                  bg={boxBg}
                  icon={<Icon w={styles.iconStyles.w} h={styles.iconStyles.h} as={MdVideoLibrary} color={brandColor} />}
                />
              }
              name={t('courseManagement.freeCourses')}
              value={stats.freeCourses}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w={styles.iconBoxStyles.w}
                  h={styles.iconBoxStyles.h}
                  bg={boxBg}
                  icon={<Icon w={styles.iconStyles.w} h={styles.iconStyles.h} as={MdOndemandVideo} color={brandColor} />}
                />
              }
              name={t('courseManagement.totalVideos')}
              value={stats.totalVideos}
            />
          </SimpleGrid>
        </Box>

        {/* Courses Section */}
        <Box sx={styles.coursesBoxStyles}>
          {/* Course Filters */}
          <Box sx={styles.filterBoxStyles}>
            <Typography 
              variant="body1" 
              sx={{ 
                ...styles.allCoursesTextStyles,
                fontFamily: getFontFamily(`${t('courseManagement.allCourses')} (${filteredCourses.length})`)
              }}
            >
              <SchoolIcon sx={styles.schoolIconStyles} />
              {t('courseManagement.allCourses')} ({filteredCourses.length})
            </Typography>
            
            <Box sx={styles.filterControlsBoxStyles}>
              <TextField
                size="small"
                placeholder={t('courseManagement.searchCourses')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={styles.searchIconStyles} />
                }}
                sx={styles.searchFieldStyles}
              />
              
              <FormControl size="small" sx={styles.selectFieldStyles}>
                <InputLabel>{t('courseManagement.courseType')}</InputLabel>
                <Select
                  value={typeFilter}
                  label={t('courseManagement.courseType')}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">{t('common.allTypes')}</MenuItem>
                  <MenuItem value="paid">{t('common.paidOnly')}</MenuItem>
                  <MenuItem value="free">{t('common.freeOnly')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <Paper sx={styles.emptyStateCardStyles}>
              <SchoolIcon sx={styles.emptyStateIconStyles} />
              <Typography 
                variant="body1" 
                sx={{ 
                  ...styles.emptyStateTitleStyles,
                  fontFamily: getFontFamily(search ? t('courseManagement.noCoursesFound') : t('courseManagement.noCoursesAvailable'))
                }}
              >
                {search ? t('courseManagement.noCoursesFound') : t('courseManagement.noCoursesAvailable')}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  ...styles.emptyStateDescriptionStyles,
                  fontFamily: getFontFamily(search ? t('courseManagement.adjustSearchTerms') : t('courseManagement.createFirstCourse'))
                }}
              >
                {search ? t('courseManagement.adjustSearchTerms') : t('courseManagement.createFirstCourse')}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => history.push('/admin/courses')}
                size="large"
                sx={styles.emptyStateButtonStyles}
              >
                {t('courseManagement.createCourse')}
              </Button>
            </Paper>
          ) : (
            <Grid {...styles.courseGridStyles}>
              {filteredCourses.map(course => (
                <Grid item {...styles.courseGridItemStyles} key={course._id}>
                  <Card
                    sx={styles.courseCardStyles}
                    onClick={() => handleCourseSelect(course)}
                  >
                      <CardMedia sx={styles.courseMediaStyles}>
                        {course.image ? (
                          <img 
                            src={`${API_URL}${course.image}`} 
                            alt={course.name}
                            style={styles.courseImageInlineStyles}
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
                            ...styles.courseFallbackIconBoxStyles,
                            ...styles.courseFallbackDisplayStyles(course.image)
                          }}
                        >
                          <SchoolIcon sx={styles.courseFallbackIconStyles} />
                        </Box>
                        
                        <Box sx={styles.courseChipContainerStyles}>
                          <Chip
                            label={course.type}
                            size="small"
                            sx={styles.courseTypeChipStyles(course.type)}
                          />
                        </Box>

                        {course.price && course.type === 'Paid' && (
                          <Box sx={styles.coursePriceBoxStyles}>
                            <AttachMoneyIcon sx={styles.coursePriceIconStyles} />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                ...styles.coursePriceTextStyles,
                                fontFamily: getFontFamily(course.price)
                              }}
                            >
                              {course.price}
                            </Typography>
                          </Box>
                        )}
                      </CardMedia>
                      
                      <CardContent sx={styles.courseContentStyles}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            ...styles.courseTitleStyles,
                            fontFamily: getFontFamily(course.name)
                          }}
                        >
                          {course.name}
                        </Typography>
                        
                        {course.courseType && (
                          <Chip 
                            label={course.courseType} 
                            size="small" 
                            variant="outlined"
                            sx={styles.courseChipMobileStyles}
                          />
                        )}
                        
                        <Box sx={styles.courseMetaBoxStyles}>
                          <Box sx={styles.courseStudentsBoxStyles}>
                            <GroupIcon sx={styles.courseStudentsIconStyles} />
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                ...styles.courseStudentsTextStyles,
                                fontFamily: getFontFamily(`${course.totalSalesCount || 0} ${t('courseManagement.students')}`)
                              }}
                            >
                              {course.totalSalesCount || 0} {t('courseManagement.students')}
                            </Typography>
                          </Box>
                          <Box sx={styles.courseTypeBoxStyles}>
                            <VideoLibraryIcon sx={styles.courseTypeIconStyles} />
                            <Typography 
                              variant="caption" 
                              color="primary.main" 
                              fontWeight={600} 
                              sx={{ 
                                ...styles.courseTypeTextStyles,
                                fontFamily: getFontFamily(course.type)
                              }}
                            >
                              {course.type}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      
                      <CardActions sx={styles.courseActionsStyles}>
                        <Button 
                          size="small" 
                          startIcon={<VideoLibraryIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseSelect(course);
                          }}
                          variant="outlined"
                          sx={styles.courseActionButtonStyles}
                        >
                          {t('courseManagement.manageVideos')}
                        </Button>
                        <Button 
                          size="small" 
                          startIcon={<UploadIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            history.push(`/admin/upload-video/${course._id}`);
                          }}
                          color="primary"
                          sx={styles.courseActionButtonStyles}
                        >
                          {t('courseManagement.uploadVideo')}
                        </Button>
                        <Button 
                          size="small" 
                          startIcon={<PreviewIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            history.push(`/admin/my-course/${course._id}`);
                          }}
                          color="secondary"
                          variant="text"
                          title={t('courseManagement.viewAsUser')}
                          sx={styles.courseActionButtonStyles}
                        >
                          {t('courseManagement.viewAsUser')}
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
