import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Grid, CircularProgress, ThemeProvider } from '@mui/material';

// Hooks
import useCourseVideos from '../../hooks/useCourseVideos';

// Components
import LoadingState from '../../components/shared/LoadingState';
import ErrorState from '../../components/shared/ErrorState';
import EmptyState from '../../components/shared/EmptyState';
import CourseHeader from '../../components/shared/CourseHeader';
import CourseInfoCard from '../../components/shared/CourseInfoCard';
import VideoFilters from '../../components/shared/VideoFilters';
import VideoCard from '../../components/shared/VideoCard';
import VideoPlayerModal from '../../components/modal/VideoPlayerModal';

// Utils & Config
import { getFontFamily } from '../../utils/textUtils';
import muiTheme from '../../theme/muiTheme';
import * as styles from './UserPages.styles';

/**
 * UserCoursePage Component
 * Displays a course with its videos for user viewing
 */
const UserCoursePage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { courseId } = useParams();

  // Video player modal state
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Course data hook
  const {
    course,
    videos,
    filteredVideos,
    loading,
    error,
    videosLoading,
    search,
    setSearch,
    sortBy,
    setSortBy,
    refetchCourse,
  } = useCourseVideos(courseId, false); // false = user mode

  // Sort options for dropdown
  const sortOptions = [
    { value: 'order', label: t('common.order') },
    { value: 'title', label: t('common.title') },
    { value: 'uploadedAt', label: t('common.uploadDate') },
  ];

  // Event Handlers
  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    setVideoPlayerOpen(true);
  };

  const handleCloseModal = () => {
    setVideoPlayerOpen(false);
    setSelectedVideo(null);
  };

  const handleBackToCourses = () => {
    history.push('/admin/my-courses');
  };

  // Render videos content section
  const renderVideosContent = () => {
    // Loading state
    if (videosLoading) {
      return (
        <Box sx={styles.videosLoadingBoxStyles}>
          <CircularProgress sx={styles.videosLoadingProgressStyles} />
          <Typography variant="h6" sx={{ fontFamily: getFontFamily(t('user.coursePage.loadingVideos')) }}>
            {t('user.coursePage.loadingVideos')}
          </Typography>
        </Box>
      );
    }

    // Empty state
    if (filteredVideos.length === 0) {
      return (
        <EmptyState
          title={search ? t('user.coursePage.noVideosMatch') : t('user.coursePage.noVideosYet')}
          description={
            search ? t('user.courses.adjustSearchTerms') : t('user.coursePage.videosWillAppear')
          }
        />
      );
    }

    // Videos grid
    return (
      <Grid {...styles.videosGridContainerStyles}>
        {filteredVideos.map((video) => (
          <Grid item {...styles.getVideoGridItemStyles('grid')} key={video._id}>
            <VideoCard
              video={video}
              viewMode="grid"
              onPlayVideo={handlePlayVideo}
              t={t}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <ThemeProvider theme={muiTheme}>
        <LoadingState message={t('user.coursePage.loadingCourse')} />
      </ThemeProvider>
    );
  }

  // Render error state
  if (error) {
    return (
      <ThemeProvider theme={muiTheme}>
        <ErrorState
          message={error}
          onRetry={refetchCourse}
          retryText={t('common.tryAgain')}
        />
      </ThemeProvider>
    );
  }

  // Render main content
  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ ...styles.containerStyles, ...styles.maxWidthContainerStyles }}>
        {/* Course Header */}
        <CourseHeader
          courseName={course?.name}
          videoCount={videos.length}
          onBack={handleBackToCourses}
          t={t}
        />

        {/* Course Information Card */}
        <CourseInfoCard course={course} />

        {/* Video Filters */}
        {videos.length > 0 && (
          <VideoFilters
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            searchPlaceholder={t('user.coursePage.searchVideos')}
            sortLabel={t('common.sortBy')}
            sortOptions={sortOptions}
          />
        )}

        {/* Videos Content */}
        {renderVideosContent()}

        {/* Video Player Modal */}
        <VideoPlayerModal
          open={videoPlayerOpen}
          onClose={handleCloseModal}
          video={selectedVideo}
          courseTitle={course?.name}
          isUserMode={true}
        />
      </Box>
    </ThemeProvider>
  );
};

export default UserCoursePage;
