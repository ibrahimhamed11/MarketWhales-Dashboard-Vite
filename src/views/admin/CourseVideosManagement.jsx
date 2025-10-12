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
  Container
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
  BarChart as BarChartIcon,
  ArrowBack as ArrowBackIcon,
  AccessTime as AccessTimeIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon
} from '@mui/icons-material';

import useCourseVideos from '../../hooks/useCourseVideos';
import { formatDuration, formatFileSize } from '../../utils/courses/videoUtils';
import VideoAnalyticsModal from '../../components/modal/VideoAnalyticsModal';
import VideoPlayerModal from '../../components/modal/VideoPlayerModal';
import MuxVideoPlayer from '../../components/mux/MuxVideoPlayer';
import InlineVideoPlayer from '../../components/video/InlineVideoPlayer';
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

const CourseVideosManagement = () => {
  const history = useHistory();
  const { courseId } = useParams();

  // UI state
  const [viewMode, setViewMode] = useState('grid');
  const [showInlinePlayer, setShowInlinePlayer] = useState(false);

  // Video player modal state
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [inlineSelectedVideo, setInlineSelectedVideo] = useState(null);

  // Analytics modal state
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [selectedVideoAnalytics, setSelectedVideoAnalytics] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');

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
  } = useCourseVideos(courseId);

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    setVideoPlayerOpen(true);
  };

  const handlePlayInline = (video) => {
    setInlineSelectedVideo(video);
    setShowInlinePlayer(true);
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

  // Filtering handled by hook



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
            <Typography variant="h6" sx={{ fontFamily: getFontFamily('Loading course...') }}>Loading course...</Typography>
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
      <Container maxWidth="xl" sx={{ pt: { base: "130px", md: "80px", xl: "80px" } }}>
        
        {/* Header Section */}
        <Box sx={{ mt: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => history.push('/admin/video-courses')}
              sx={{ mr: 2 }}
            >
              Back to Courses
            </Button>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ 
                mb: 1, 
                fontWeight: 700, 
                fontFamily: getFontFamily(course?.name),
                wordWrap: 'break-word',
                overflow: 'visible'
              }}>
                {course?.name} - Videos Management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ 
                fontFamily: getFontFamily(`Manage videos for this course (${videos.length} videos)`),
                wordWrap: 'break-word',
                overflow: 'visible'
              }}>
                Manage videos for this course ({videos.length} videos)
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<UploadIcon />}
                onClick={handleUploadClick}
                sx={{ borderRadius: 3, px: 3, py: 1.5 }}
              >
                Upload New Video (Mux)
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<VideoLibraryIcon />}
                onClick={() => history.push(`/admin/mux-videos/${courseId}`)}
                sx={{ borderRadius: 3, px: 2, py: 1.5 }}
              >
                Mux Dashboard
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
                        src={course.image.startsWith('http') ? course.image : `${API_URL}${course.image}`} 
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
                      {muxStatus && (
                        <Chip
                          label={`Mux: ${muxStatus.status === 'operational' ? '✅ Active' : '❌ Inactive'}`}
                          color={muxStatus.status === 'operational' ? 'success' : 'error'}
                          size="small"
                        />
                      )}
                      {muxLoading && (
                        <Chip
                          label="Checking Mux..."
                          variant="outlined"
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
            flexWrap: 'wrap'
          }}>
            <TextField
              size="small"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ minWidth: 250 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="order">Order</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="uploadedAt">Upload Date</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Videos</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
                <MenuItem value="inactive">Inactive Only</MenuItem>
              </Select>
            </FormControl>

            <Tooltip title="Toggle view mode">
              <IconButton 
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                sx={{ ml: 'auto' }}
              >
                {viewMode === 'grid' ? <ViewListIcon /> : <GridViewIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Inline Video Player Section */}
        {showInlinePlayer && inlineSelectedVideo && (
          <InlineVideoPlayer 
            video={inlineSelectedVideo}
            onClose={() => setShowInlinePlayer(false)}
          />
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
            >
              Upload First Video
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredVideos.map(video => (
              <Grid item xs={12} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12} key={video._id}>
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
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' },
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
                    <Typography variant="body1" sx={{ 
                      mb: 1, 
                      fontWeight: 600, 
                      fontFamily: getFontFamily(video.title),
                      wordWrap: 'break-word',
                      overflow: 'visible'
                    }}>
                      {video.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {video.description || 'No description provided'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StorageIcon fontSize="small" color="action" />
                        <Typography variant="caption">
                          {formatFileSize(video.fileSize)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <VisibilityIcon fontSize="small" color="action" />
                        <Typography variant="caption">
                          {video.viewCount || 0} views
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      onClick={() => handlePlayVideo(video)}
                      variant="contained"
                      size="small"
                      startIcon={<PlayArrowIcon />}
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      Play Modal
                    </Button>
                    
                    <Button
                      onClick={() => handlePlayInline(video)}
                      variant="outlined"
                      size="small"
                      startIcon={<PlayCircleFilledIcon />}
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      Play Here
                    </Button>
                    
                    <Button
                      onClick={() => handleToggleVideoStatus(video._id, video.isActive)}
                      variant="outlined"
                      size="small"
                      startIcon={video.isActive ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      color={video.isActive ? 'warning' : 'success'}
                    >
                      {video.isActive ? 'Hide' : 'Show'}
                    </Button>
                    
                    <Button
                      onClick={() => {
                        // Defer fetch until modal is opened; keep existing behavior
                        import('../../apis/courses/videosCourses').then(({ adminVideoAPI }) => {
                          adminVideoAPI.getVideoAnalytics(video._id).then((analytics) => {
                            setSelectedVideoAnalytics(analytics);
                            setSelectedVideoTitle(video.title);
                            setAnalyticsModalOpen(true);
                          });
                        });
                      }}
                      variant="outlined"
                      size="small"
                      startIcon={<BarChartIcon />}
                    >
                      Analytics
                    </Button>
                    
                    <Button
                      onClick={() => handleVideoDelete(video._id)}
                      variant="outlined"
                      size="small"
                      startIcon={<DeleteIcon />}
                      color="error"
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

        {/* Analytics Modal */}
        <VideoAnalyticsModal
          open={analyticsModalOpen}
          onClose={() => setAnalyticsModalOpen(false)}
          analytics={selectedVideoAnalytics}
          videoTitle={selectedVideoTitle}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CourseVideosManagement;
