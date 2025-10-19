import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Alert,
  Button,
  Snackbar,
  ThemeProvider,
} from '@mui/material';
import { PlayCircleFilled as PlayCircleFilledIcon, Upload as UploadIcon } from '@mui/icons-material';

import useCourseVideos from '../../../hooks/useCourseVideos';
import VideoPlayerModal from '../../../components/modal/VideoPlayerModal';
import muiTheme from '../../../theme/muiTheme';
import { getFontFamily } from '../../../utils/textUtils';

// Import custom components
import {
  LoadingState,
  EmptyState,
  CourseInfoCard,
  AdminVideoCard,
  AdminVideoFilters,
  CourseVideoHeader,
} from '../../../components';

// Import styles
import * as styles from './CourseVideosManagement.styles';

const CourseVideosManagement = () => {
  const history = useHistory();
  const { courseId } = useParams();
  const { t } = useTranslation();

  // UI state
  const [viewMode, setViewMode] = useState('grid');

  // Video player modal state
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Editing state
  const [editingVideo, setEditingVideo] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const {
    course,
  videos,
    filteredVideos,
    loading,
    error,
    videosLoading,
    muxStatus,
    muxLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
  refetchCourse,
    refetchVideos,
    toggleVideoStatus,
    deleteVideo,
    updateVideo,
  } = useCourseVideos(courseId);

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    setVideoPlayerOpen(true);
  };

  const handlePlayVideoNewPage = (video) => {
    history.push(`/admin/video-player/${courseId}/${video._id}`);
  };

  const handleUploadClick = () => {
    history.push(`/admin/upload-video/${courseId}`);
  };

  const handleVideoDelete = async (videoId) => {
    if (!window.confirm(t('courseVideoManagement.confirmDeleteVideo'))) return;
    await deleteVideo(videoId);
  };

  const handleToggleVideoStatus = async (videoId, isActive) => {
    await toggleVideoStatus(videoId, isActive);
  };

  const handleDeleteEmptyVideos = async () => {
    const emptyVideos = videos.filter(video => 
      !video.fileSize || video.fileSize === 0 || video.fileSize === '0'
    );
    
    if (emptyVideos.length === 0) {
      alert(t('courseVideoManagement.noEmptyVideosFound'));
      return;
    }
    
    const confirmed = window.confirm(
      t('courseVideoManagement.deleteEmptyVideosConfirm', { count: emptyVideos.length })
    );
    
    if (!confirmed) return;
    
    try {
      for (const video of emptyVideos) {
        await deleteVideo(video._id);
      }
      alert(t('courseVideoManagement.deletedEmptyVideosSuccess', { count: emptyVideos.length }));
    } catch (error) {
      console.error('Error deleting empty videos:', error);
      alert(t('courseVideoManagement.errorDeletingVideos'));
    }
  };

  const handleDeleteZeroViewVideos = async () => {
    const zeroViewVideos = videos.filter(video => 
      !video.viewCount || video.viewCount === 0
    );
    
    if (zeroViewVideos.length === 0) {
      alert(t('courseVideoManagement.noZeroViewVideosFound'));
      return;
    }
    
    const confirmed = window.confirm(
      t('courseVideoManagement.deleteZeroViewVideosConfirm', { count: zeroViewVideos.length })
    );
    
    if (!confirmed) return;
    
    try {
      for (const video of zeroViewVideos) {
        await deleteVideo(video._id);
      }
      alert(t('courseVideoManagement.deletedZeroViewVideosSuccess', { count: zeroViewVideos.length }));
    } catch (error) {
      console.error('Error deleting zero-view videos:', error);
      alert(t('courseVideoManagement.errorDeletingVideos'));
    }
  };

  // Edit video functionality
  const handleEditVideo = (video) => {
    setEditingVideo(video._id);
    setEditedTitle(video.title || '');
    setEditedDescription(video.description || '');
  };

  const handleCancelEdit = () => {
    setEditingVideo(null);
    setEditedTitle('');
    setEditedDescription('');
  };

  const handleSaveEdit = async (videoId) => {
    if (!editedTitle.trim()) {
      setSnackbarMessage(t('courseVideoManagement.titleCannotBeEmpty'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setSaving(true);
    try {
      await updateVideo(videoId, {
        title: editedTitle.trim(),
        description: editedDescription.trim()
      });
      
      setEditingVideo(null);
      setEditedTitle('');
      setEditedDescription('');
      setSnackbarMessage(t('courseVideoManagement.videoUpdatedSuccess'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating video:', error);
      setSnackbarMessage(t('courseVideoManagement.failedToUpdateVideo'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Filtering handled by hook



  if (loading) {
    return (
      <ThemeProvider theme={muiTheme}>
        <Container maxWidth="xl">
          <LoadingState message={t('courseVideoManagement.loadingCourse')} />
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={muiTheme}>
        <Container maxWidth="xl">
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={refetchCourse}>
                {t('common.tryAgain')}
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
      <Container maxWidth="xl" sx={styles.containerStyles}>
        
        {/* Header Section */}
        <CourseVideoHeader
          courseName={course?.name}
          videosCount={videos.length}
          onBackClick={() => history.push('/admin/video-courses')}
          onUploadClick={handleUploadClick}
        />

        {/* Course Info Card */}
        <CourseInfoCard course={course} />

        {/* Video Filters */}
        <AdminVideoFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          videosCount={videos.length}
        />



        {/* Videos Content */}
        {videosLoading ? (
          <LoadingState message={t('courseVideoManagement.loadingVideos')} />
        ) : filteredVideos.length === 0 ? (
          <EmptyState
            icon={PlayCircleFilledIcon}
            title={
              search || statusFilter !== 'all' 
                ? t('courseVideoManagement.noVideosMatchFilters') 
                : t('courseVideoManagement.noVideosFound')
            }
            description={
              search || statusFilter !== 'all' 
                ? t('courseVideoManagement.tryAdjustingFilters') 
                : t('courseVideoManagement.uploadFirstVideo')
            }
          >
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={handleUploadClick}
              size="large"
              sx={styles.emptyStateButtonStyles}
            >
              {t('courseVideoManagement.uploadFirstVideoButton')}
            </Button>
          </EmptyState>
        ) : (
          <Grid container spacing={3}>
            {filteredVideos.map(video => (
              <Grid 
                item 
                xs={12} 
                sm={viewMode === 'grid' ? 6 : 12} 
                md={viewMode === 'grid' ? 4 : 12} 
                lg={viewMode === 'grid' ? 3 : 12} 
                key={video._id}
              >
                <AdminVideoCard
                  video={video}
                  viewMode={viewMode}
                  editingVideo={editingVideo}
                  editedTitle={editedTitle}
                  editedDescription={editedDescription}
                  saving={saving}
                  onPlayVideo={handlePlayVideo}
                  onPlayVideoNewPage={handlePlayVideoNewPage}
                  onToggleStatus={handleToggleVideoStatus}
                  onDelete={handleVideoDelete}
                  onEdit={handleEditVideo}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onTitleChange={setEditedTitle}
                  onDescriptionChange={setEditedDescription}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Video Player Modal */}
        <VideoPlayerModal
          open={videoPlayerOpen}
          onClose={() => {
            setVideoPlayerOpen(false);
            setSelectedVideo(null);
          }}
          video={selectedVideo}
          courseTitle={course?.name}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={styles.snackbarAnchorOrigin}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbarSeverity}
            sx={styles.snackbarAlertStyles}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default CourseVideosManagement;
