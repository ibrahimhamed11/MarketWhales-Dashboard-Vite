import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  LinearProgress,
  ThemeProvider,
  Tooltip,
  Divider,
  Container,
  Snackbar
} from '@mui/material';

// Icons
import {
  VideoLibrary as VideoLibraryIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  PlayArrow as PlayArrowIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Storage as StorageIcon,
  ArrowBack as ArrowBackIcon,
  AccessTime as AccessTimeIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  BarChart as BarChartIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

import useCourseVideos from '../../../hooks/useCourseVideos';
import { formatDuration, formatFileSize } from '../../../utils/courses/videoUtils';
import VideoPlayerModal from '../../../components/modal/VideoPlayerModal';
import muiTheme from '../../../theme/muiTheme';
import { API_URL } from '../../../apis/config';

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

const CourseVideosManagement = () => {
  const history = useHistory();
  const { courseId } = useParams();

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
    if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) return;
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
      alert('No videos with 0 bytes found.');
      return;
    }
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${emptyVideos.length} video(s) with 0 bytes? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      for (const video of emptyVideos) {
        await deleteVideo(video._id);
      }
      alert(`Successfully deleted ${emptyVideos.length} empty video(s).`);
    } catch (error) {
      console.error('Error deleting empty videos:', error);
      alert('Error occurred while deleting videos. Please try again.');
    }
  };

  const handleDeleteZeroViewVideos = async () => {
    const zeroViewVideos = videos.filter(video => 
      !video.viewCount || video.viewCount === 0
    );
    
    if (zeroViewVideos.length === 0) {
      alert('No videos with 0 views found.');
      return;
    }
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${zeroViewVideos.length} video(s) with 0 views? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      for (const video of zeroViewVideos) {
        await deleteVideo(video._id);
      }
      alert(`Successfully deleted ${zeroViewVideos.length} video(s) with 0 views.`);
    } catch (error) {
      console.error('Error deleting zero-view videos:', error);
      alert('Error occurred while deleting videos. Please try again.');
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
      setSnackbarMessage('Title cannot be empty');
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
      setSnackbarMessage('Video updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating video:', error);
      setSnackbarMessage('Failed to update video. Please try again.');
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
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            flexDirection: 'column'
          }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ fontFamily: getFontFamily('Loading course...') }}>Loading course...</Typography>
          </Box>
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
              <Button color="inherit" size="small" onClick={fetchCourse}>
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
      <Container maxWidth="xl" sx={{ pt: { xs: "130px", md: "80px", xl: "80px" }, px: { xs: 1, sm: 1 } }}>
        
        {/* Header Section */}
        <Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            mb: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => history.push('/admin/video-courses')}
              sx={{ 
                mr: { sm: 2 },
                textTransform: 'capitalize'
              }}
            >
              Back to courses
            </Button>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h5" sx={{ 
                mb: 1, 
                fontWeight: 700, 
                fontFamily: getFontFamily(course?.name),
                wordWrap: 'break-word',
                overflow: 'visible',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}>
                {course?.name} - Videos management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ 
                fontFamily: getFontFamily(`Manage videos for this course (${videos.length} videos)`),
                wordWrap: 'break-word',
                overflow: 'visible'
              }}>
                Manage videos for this course ({videos.length} videos)
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Button
                variant="contained"
                size="medium"
                startIcon={<UploadIcon />}
                onClick={handleUploadClick}
                sx={{ 
                  borderRadius: 2, 
                  px: 2, 
                  py: 1, 
                  minWidth: '120px',
                  fontSize: '0.875rem',
                  textTransform: 'capitalize',
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Upload new video
              </Button>
            </Stack>
          </Box>

          {/* Course Info Card */}
          {course && (
            <Card sx={{ mb: 5, bgcolor: 'primary.50' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    bgcolor: 'primary.100',
                    border: '2px solid',
                    borderColor: 'primary.200'
                  }}>
                    {course.image ? (
                      <img 
                        src={course.image.startsWith('http') ? course.image : `${API_URL}/${course.image}`} 
                        alt={course.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <VideoLibraryIcon 
                      sx={{ 
                        fontSize: 40, 
                        color: 'primary.main',
                        display: course.image ? 'none' : 'flex'
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ 
                      mb: 1, 
                      fontFamily: getFontFamily(course.name),
                      wordWrap: 'break-word',
                      overflow: 'visible'
                    }}>
                      {course.name}
                    </Typography>
                    {course.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mb: 2, 
                        fontFamily: getFontFamily(course.description),
                        wordWrap: 'break-word',
                        overflow: 'visible'
                      }}>
                        {course.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={course.type}
                        color={course.type === 'Paid' ? 'primary' : 'secondary'}
                        size="small"
                      />
                      {course.courseType && (
                        <Chip
                          label={course.courseType}
                          variant="outlined"
                          size="small"
                        />
                      )}
                      {course.price && course.type === 'Paid' && (
                        <Chip
                          label={`$${course.price}`}
                          color="success"
                          size="small"
                        />
                      )}

                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Video Filters */}
        {videos.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            alignItems: 'center', 
            mb: 4,
            mt: 4,
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' }
          }}>
            <TextField
              size="small"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ 
                minWidth: { xs: '100%', sm: 250 },
                flex: { xs: 1, sm: 'none' }
              }}
            />
            
            <FormControl size="small" sx={{ 
              minWidth: { xs: '100%', sm: 150 },
              flex: { xs: 1, sm: 'none' }
            }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="order">Order</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="uploadedAt">Upload date</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ 
              minWidth: { xs: '100%', sm: 150 },
              flex: { xs: 1, sm: 'none' }
            }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All videos</MenuItem>
                <MenuItem value="active">Active only</MenuItem>
                <MenuItem value="inactive">Inactive only</MenuItem>
              </Select>
            </FormControl>


          </Box>
        )}



        {/* Videos Content */}
    {videosLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
            <CircularProgress sx={{ mr: 2 }} />
            <Typography variant="h6" sx={{ fontFamily: getFontFamily('Loading videos...') }}>Loading videos...</Typography>
          </Box>
    ) : filteredVideos.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <PlayCircleFilledIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
      {search || statusFilter !== 'all' 
                ? 'No videos match your filters' 
                : 'No videos found'
              }
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      {search || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Upload your first video to get started'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={handleUploadClick}
              size="large"
              sx={{ textTransform: 'capitalize' }}
            >
              Upload first video
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredVideos.map(video => (
              <Grid item xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12} lg={viewMode === 'grid' ? 3 : 12} key={video._id}>
                <Card sx={{ 
                  height: '100%',
                  '&:hover': { boxShadow: 4 }
                }}>
                  {/* Video Thumbnail */}
                  <Box sx={{ position: 'relative', height: viewMode === 'grid' ? 200 : 120 }}>
                    {video.thumbnailKey ? (
                      <CardMedia
                        component="img"
                        height={viewMode === 'grid' ? 200 : 120}
                        image={
                          video.thumbnailKey 
                            ? (video.thumbnailKey.startsWith('http') 
                                ? video.thumbnailKey 
                                : `${API_URL}/api/files/${video.thumbnailKey}`)
                            : `${API_URL}/placeholder-thumbnail.jpg`
                        }
                        alt={video.title}
                        sx={{ objectFit: 'cover' }}
                        onError={(e) => {
                          console.error('Thumbnail load error:', e.target.src);
                          // If image fails to load, show icon fallback
                          e.target.style.display = 'none';
                          const fallback = e.target.parentElement.querySelector('.thumbnail-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback icon display */}
                    <Box 
                      className="thumbnail-fallback"
                      sx={{
                        height: '100%',
                        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: video.thumbnailKey ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 1
                      }}
                    >
                      <PlayCircleFilledIcon 
                        sx={{ 
                          fontSize: viewMode === 'grid' ? 60 : 40, 
                          color: 'white',
                          opacity: 0.9
                        }} 
                      />
                      <Typography 
                        variant={viewMode === 'grid' ? 'body1' : 'body2'} 
                        color="white" 
                        fontWeight={600}
                        sx={{ 
                          opacity: 0.8,
                          fontFamily: getFontFamily(`Video ${video.order}`)
                        }}
                      >
                        Video {video.order}
                      </Typography>
                    </Box>
                    
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      display: 'flex',
                      gap: 1
                    }}>
                      <Chip
                        label={`#${video.order}`}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip
                        label={video.isActive ? 'Active' : 'Inactive'}
                        color={video.isActive ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    
                    <Box sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      <Typography variant="caption" fontWeight={600}>
                        {formatDuration(video.duration)}
                      </Typography>
                    </Box>

                    <IconButton
                      onClick={() => handlePlayVideo(video)}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          bgcolor: 'rgba(0,0,0,0.9)',
                          transform: 'translate(-50%, -50%) scale(1.1)'
                        }
                      }}
                    >
                      <PlayArrowIcon fontSize="large" />
                    </IconButton>
                  </Box>

                  <CardContent>
                    {editingVideo === video._id ? (
                      // Edit mode
                      <Box>
                        <TextField
                          fullWidth
                          size="small"
                          label="Video Title"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          sx={{ 
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              fontFamily: getFontFamily(editedTitle),
                            }
                          }}
                          inputProps={{ maxLength: 100 }}
                          helperText={`${editedTitle.length}/100 characters`}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Video Description"
                          multiline
                          rows={3}
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          sx={{ 
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              fontFamily: getFontFamily(editedDescription),
                            }
                          }}
                          inputProps={{ maxLength: 500 }}
                          helperText={`${editedDescription.length}/500 characters`}
                        />
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            onClick={handleCancelEdit}
                            startIcon={<CancelIcon />}
                            sx={{ textTransform: 'capitalize' }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleSaveEdit(video._id)}
                            startIcon={saving ? <CircularProgress size={14} /> : <SaveIcon />}
                            disabled={saving || !editedTitle.trim()}
                            sx={{ textTransform: 'capitalize' }}
                          >
                            Save
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      // View mode
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1" sx={{ 
                            fontWeight: 600, 
                            fontFamily: getFontFamily(video.title),
                            wordWrap: 'break-word',
                            overflow: 'visible',
                            flex: 1,
                            mr: 1
                          }}>
                            {video.title}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleEditVideo(video)}
                            sx={{ 
                              p: 0.5,
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontFamily: getFontFamily(video.description)
                          }}
                        >
                          {video.description || 'No description provided'}
                        </Typography>
                      </Box>
                    )}

                  </CardContent>
                  
                  <CardActions sx={{ 
                    p: 1, 
                    gap: 0.5, 
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}>
                    <Button
                      onClick={() => handlePlayVideo(video)}
                      variant="contained"
                      size="small"
                      startIcon={<PlayArrowIcon />}
                      color="primary"
                      sx={{ 
                        minWidth: { xs: '70px', sm: '75px' },
                        fontSize: '0.75rem',
                        px: 1,
                        py: 0.5,
                        height: '28px',
                        textTransform: 'capitalize'
                      }}
                    >
                      Play modal
                    </Button>
                    
                    <Button
                      onClick={() => handlePlayVideoNewPage(video)}
                      variant="outlined"
                      size="small"
                      startIcon={<PlayCircleFilledIcon />}
                      color="primary"
                      sx={{ 
                        minWidth: { xs: '75px', sm: '80px' },
                        fontSize: '0.75rem',
                        px: 1,
                        py: 0.5,
                        height: '28px',
                        textTransform: 'capitalize'
                      }}
                    >
                      New page
                    </Button>
                    
                    <Button
                      onClick={() => handleToggleVideoStatus(video._id, video.isActive)}
                      variant="outlined"
                      size="small"
                      startIcon={video.isActive ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      color={video.isActive ? 'warning' : 'success'}
                      sx={{ 
                        minWidth: { xs: '60px', sm: '65px' },
                        fontSize: '0.75rem',
                        px: 1,
                        py: 0.5,
                        height: '28px',
                        textTransform: 'capitalize'
                      }}
                    >
                      {video.isActive ? 'Hide' : 'Show'}
                    </Button>
                    
         
                    
                    <Button
                      onClick={() => handleVideoDelete(video._id)}
                      variant="outlined"
                      size="small"
                      startIcon={<DeleteIcon />}
                      color="error"
                      sx={{ 
                        minWidth: { xs: '60px', sm: '65px' },
                        fontSize: '0.75rem',
                        px: 1,
                        py: 0.5,
                        height: '28px',
                        textTransform: 'capitalize'
                      }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default CourseVideosManagement;
