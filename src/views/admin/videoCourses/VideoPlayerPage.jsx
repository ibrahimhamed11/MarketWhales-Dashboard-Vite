import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
  ThemeProvider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { adminVideoAPI } from '../../../apis/courses/videosCourses';
import MuxVideoPlayer from '../../../components/videoCourses/MuxVideoPlayer';
import muiTheme from '../../../theme/muiTheme';

const VideoPlayerPage = () => {
  const history = useHistory();
  const { courseId, videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (courseId && videoId) {
      fetchVideoDetails();
    }
  }, [courseId, videoId]);

  // Update document title when video is loaded
  useEffect(() => {
    if (video?.title) {
      document.title = `${video.title} - Video Player`;
    }
    return () => {
      document.title = 'MarketWhales Dashboard';
    };
  }, [video]);

  const fetchVideoDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get all videos from the course and find the specific video
      const response = await adminVideoAPI.getCourseVideos(courseId, true);
      const videos = response.data?.videos || response.videos || response;
      const foundVideo = videos.find(v => v._id === videoId);
      
      if (foundVideo) {
        setVideo(foundVideo);
      } else {
        setError('Video not found in this course');
      }
    } catch (err) {
      console.error('Error fetching video details:', err);
      setError('Failed to load video details');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    history.goBack();
  };

  if (loading) {
    return (
      <ThemeProvider theme={muiTheme}>
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress sx={{ color: '#fff' }} />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={muiTheme}>
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <Alert severity="error" sx={{ backgroundColor: '#fff', color: '#000' }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={handleGoBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            Go Back
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  if (!video) {
    return (
      <ThemeProvider theme={muiTheme}>
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff' }}>
            Video not found
          </Typography>
          <Button
            variant="contained"
            onClick={handleGoBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            Go Back
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <Container 
        maxWidth={false}
        sx={{
          pt: { xs: "160px", md: "130px", xl: "130px" },
          px: { xs: 2, sm: 3, md: 4 },
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            pt: { xs: 4, md: 6 },
            pb: 6,
            maxWidth: '1400px',
            mx: 'auto'
          }}
        >

        {/* Video Player Container */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            backgroundColor: '#000',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            aspectRatio: '16/9',
            mx: 'auto'
          }}
        >
          <MuxVideoPlayer 
            videoId={video._id}
            autoPlay={true}
            onError={(error) => setError(error)}
            style={{ 
              width: '100%', 
              height: '100%',
              borderRadius: '8px'
            }}
          />
        </Box>

        {/* Video Description */}
        {video?.description && (
          <Box
            sx={{
              width: '100%',
              maxWidth: '1200px',
              backgroundColor: '#fff',
              borderRadius: 2,
              padding: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              mx: 'auto'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#333'
              }}
            >
              About This Video
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                lineHeight: 1.6
              }}
            >
              {video.description}
            </Typography>
          </Box>
        )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default VideoPlayerPage;
