import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

import { videoService } from '../../apis/mux/videoApi';
import { formatDuration } from '../../utils/courses/videoUtils';

// Utility function to detect Arabic text
const hasArabic = (text) => {
  if (!text) return false;
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicRegex.test(text);
};

const getFontFamily = (text) => {
  return hasArabic(text) ? 'Droid' : 'inherit';
};

const InlineVideoPlayer = ({ video, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamData, setStreamData] = useState(null);

  useEffect(() => {
    if (video) {
      loadVideoStream();
    }
  }, [video]);

  const loadVideoStream = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading inline video stream for:', video);
      
      const data = await videoService.getAdminVideoStream(video._id);
      setStreamData(data);
      
    } catch (err) {
      console.error('Error loading inline video stream:', err);
      setError('Failed to load video stream');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 4, overflow: 'hidden' }}>
      <CardContent sx={{ p: 0, position: 'relative' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          bgcolor: 'background.default'
        }}>
          <Typography variant="h6" sx={{ 
            fontFamily: getFontFamily(video.title)
          }}>
            Now Playing: {video.title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <ArrowBackIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ position: 'relative', bgcolor: 'black', minHeight: '400px' }}>
          {loading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: 400,
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress size={60} sx={{ color: 'white' }} />
              <Typography variant="body1" color="white">
                Loading video...
              </Typography>
            </Box>
          )}

          {error && (
            <Box sx={{ p: 3 }}>
              <Alert severity="error">
                {error}
              </Alert>
            </Box>
          )}

          {streamData && !loading && !error && (
            <video
              controls={true}
              autoPlay={true}
              playsInline
              style={{
                width: '100%',
                height: 'auto',
                minHeight: '400px',
                backgroundColor: 'black'
              }}
            >
              <source src={streamData.streamUrl} type="application/x-mpegURL" />
              <source src={streamData.streamUrl.replace('.m3u8', '.mp4')} type="video/mp4" />
              <Box sx={{ p: 3, textAlign: 'center', color: 'white' }}>
                <Typography variant="body2">
                  Your browser does not support this video format.
                </Typography>
              </Box>
            </video>
          )}
        </Box>
        
        <Box sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
            {video.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {video.description || 'No description provided'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={`Order: ${video.order}`} size="small" />
            <Chip label={formatDuration(video.duration)} size="small" />
            <Chip 
              label={video.isActive ? 'Active' : 'Inactive'} 
              color={video.isActive ? 'success' : 'default'}
              size="small"
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InlineVideoPlayer;
