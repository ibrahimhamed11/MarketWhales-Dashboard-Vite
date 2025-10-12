import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon
} from '@mui/icons-material';

import { adminVideoAPI } from '../../apis/courses/videosCourses';
import { videoService } from '../../apis/mux/videoApi';
import { formatDuration } from '../../utils/courses/videoUtils';
import MuxVideoPlayer from '../videoCourses/MuxVideoPlayer';

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

const VideoPlayerModal = ({ 
  open, 
  onClose, 
  video, 
  courseTitle 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [detailedError, setDetailedError] = useState(null);
  const [errorDetailsOpen, setErrorDetailsOpen] = useState(false);
  
  const dialogRef = useRef(null);

  // Fetch video stream data when modal opens
  useEffect(() => {
    if (open && video?._id && !streamData) {
      fetchVideoStream();
    }
  }, [open, video]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStreamData(null);
      setError(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsFullscreen(false);
      setHasUserInteracted(false);
    }
  }, [open]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const fetchVideoStream = async () => {
    if (!video?._id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Try to get Mux stream first
      const data = await videoService.getAdminVideoStream(video._id);
      setStreamData(data);
      
      // Log stream type for debugging
      if (data.streamUrl.includes('.m3u8') || data.streamUrl.includes('hls')) {
        console.log('HLS stream detected - using Mux integration');
      }
    } catch (err) {
      console.error('Error fetching Mux video stream:', err);
      
      // Fallback to legacy video API
      try {
        const fallbackData = await adminVideoAPI.getAdminVideoStream(video._id);
        setStreamData(fallbackData);
      } catch (fallbackErr) {
        console.error('Error fetching fallback video stream:', fallbackErr);
        logError(fallbackErr, 'Video Stream Fetch (Fallback)');
        setError('Failed to load video. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Simple fullscreen toggle for modal
  const handleFullscreenToggle = async () => {
    try {
      if (!isFullscreen) {
        if (dialogRef.current?.requestFullscreen) {
          await dialogRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  // Log detailed error information
  const logError = (error, context = 'Unknown') => {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      context,
      error: {
        name: error.name || 'Unknown',
        message: error.message || 'No message',
        code: error.code || 'No code',
        stack: error.stack || 'No stack trace'
      },
      video: {
        src: streamData?.streamUrl || 'No source',
        duration: duration || 0,
        currentTime: currentTime || 0,
        paused: !isPlaying
      },
      userAgent: navigator.userAgent,
      network: {
        online: navigator.onLine,
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : 'Not available'
      }
    };

    setDetailedError(errorDetails);
  };

  return (
    <Dialog
      ref={dialogRef}
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      fullScreen={isMobile || isFullscreen}
      PaperProps={{
        sx: {
          width: isFullscreen ? '100vw' : { xs: '95vw', sm: '90vw', md: '80vw', lg: '70vw' },
          height: isFullscreen ? '100vh' : 'auto',
          maxWidth: isFullscreen ? 'none' : '1200px',
          bgcolor: isFullscreen ? 'black' : 'background.paper',
          color: isFullscreen ? 'white' : 'inherit'
        }
      }}
    >
      {/* Dialog Title */}
      {!isFullscreen && (
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              fontFamily: getFontFamily(video?.title || ''),
              mb: 0.5
            }}>
              {video?.title || 'Video Player'}
            </Typography>
            {courseTitle && (
              <Typography variant="body2" color="text.secondary" sx={{
                fontFamily: getFontFamily(courseTitle)
              }}>
                {courseTitle}
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}

      {/* Dialog Content */}
      <DialogContent
        sx={{
          p: isFullscreen ? 0 : 2,
          height: isFullscreen ? '100vh' : 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: isMobile ? '250px' : '400px',
              gap: 2
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="body1" sx={{ fontFamily: getFontFamily('Loading video...') }}>
              Loading video...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Box sx={{ minHeight: isMobile ? '250px' : '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
            <Alert 
              severity="error" 
              sx={{ width: '100%', mb: 2 }}
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button color="inherit" size="small" onClick={() => setErrorDetailsOpen(true)}>
                    Details
                  </Button>
                  <Button color="inherit" size="small" onClick={fetchVideoStream}>
                    Retry
                  </Button>
                </Box>
              }
            >
              {error}
            </Alert>
            
            {/* Simple error actions */}
            <Box sx={{ width: '100%', mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                size="small" 
                color="info"
                onClick={() => setErrorDetailsOpen(true)}
              >
                View Error Details
              </Button>
              
              {streamData?.streamUrl && (
                <Button 
                  variant="outlined" 
                  size="small" 
                  href={streamData.streamUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Download Video
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* Mux Video Player */}
        {!loading && !error && (
          <Box
            sx={{
              width: '100%',
              height: isFullscreen ? '100vh' : 'auto',
              minHeight: isFullscreen ? '100vh' : { xs: '250px', sm: '350px', md: '450px', lg: '500px' },
              borderRadius: isFullscreen ? 0 : 2,
              overflow: 'hidden',
              bgcolor: 'black'
            }}
          >
            <MuxVideoPlayer
              videoId={video?._id}
              onProgress={(currentTime, duration) => {
                setCurrentTime(currentTime);
                setDuration(duration);
              }}
              onError={(error) => {
                console.error('Video player error:', error);
                logError(error, 'Video Player Error');
                setError('Video playback failed. Please try again.');
              }}
              style={{
                width: '100%',
                height: isFullscreen ? '100vh' : 'auto',
                minHeight: isFullscreen ? '100vh' : 300
              }}
            />
          </Box>
        )}

        {/* Video Information */}
        {video && streamData && !isFullscreen && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={`Video #${video.order}`} color="primary" size="small" />
              <Chip 
                label={video.isActive ? 'Active' : 'Inactive'} 
                color={video.isActive ? 'success' : 'default'} 
                size="small" 
              />
              <Chip label={formatDuration(video.duration)} variant="outlined" size="small" />
            </Box>

            {video.description && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{
                  fontFamily: getFontFamily(video.description),
                  lineHeight: 1.6
                }}>
                  {video.description}
                </Typography>
              </>
            )}
          </Box>
        )}
      </DialogContent>

      {/* Dialog Actions */}
      {!isFullscreen && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      )}

      {/* Error Details Modal */}
      <Dialog
        open={errorDetailsOpen}
        onClose={() => setErrorDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            bgcolor: 'background.paper'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'error.main',
            color: 'error.contrastText'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            🐛 Error Details & Debug Info
          </Typography>
          <IconButton 
            onClick={() => setErrorDetailsOpen(false)} 
            size="small"
            sx={{ color: 'error.contrastText' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2 }}>
          {detailedError && (
            <Box>
              {/* Current Error */}
              <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
                📍 Latest Error
              </Typography>
              
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Time:</strong> {new Date(detailedError.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Context:</strong> {detailedError.context}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Error Name:</strong> {detailedError.error.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Message:</strong> {detailedError.error.message}
                </Typography>
                {detailedError.error.code && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Code:</strong> {detailedError.error.code}
                  </Typography>
                )}
              </Box>

              {/* Copy to Clipboard */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  📋 Copy error details to share with support:
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(detailedError, null, 2));
                  }}
                >
                  Copy Error Details
                </Button>
              </Box>
            </Box>
          )}

          {!detailedError && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No error details available. Errors will appear here when they occur.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setErrorDetailsOpen(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default VideoPlayerModal;
