import React, { forwardRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon
} from '@mui/icons-material';

const MuxVideoPlayer = forwardRef(({ 
  videoId,
  playbackId,
  title,
  onLoad,
  onError,
  onPlay,
  onPause,
  controls = true,
  autoPlay = false,
  muted = false,
  loading = false,
  sx = {},
  ...props 
}, ref) => {
  
  const handleLoad = () => {
    console.log('Mux video loaded:', title || videoId);
    onLoad?.();
  };

  const handleError = (error) => {
    console.error('Mux video error:', error);
    onError?.(error);
  };

  const handlePlay = () => {
    console.log('Video playing:', title || videoId);
    onPlay?.();
  };

  const handlePause = () => {
    console.log('Video paused:', title || videoId);
    onPause?.();
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 200,
        bgcolor: 'grey.900',
        borderRadius: 1,
        flexDirection: 'column',
        gap: 2,
        ...sx
      }}>
        <CircularProgress size={60} sx={{ color: 'white' }} />
        <Typography variant="body1" color="white">
          Loading video...
        </Typography>
      </Box>
    );
  }

  if (!playbackId && !videoId) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 200,
        bgcolor: 'grey.100',
        borderRadius: 1,
        border: '2px dashed',
        borderColor: 'grey.300',
        ...sx
      }}>
        <Typography variant="body2" color="text.secondary">
          {title ? `Video not available: ${title}` : 'No video source provided'}
        </Typography>
      </Box>
    );
  }

  const videoSrc = playbackId 
    ? `https://stream.mux.com/${playbackId}.m3u8`
    : null;

  return (
    <Box sx={{ width: '100%', position: 'relative', borderRadius: 1, overflow: 'hidden', ...sx }}>
      {videoSrc ? (
        <video
          ref={ref}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          playsInline
          onLoadedData={handleLoad}
          onError={handleError}
          onPlay={handlePlay}
          onPause={handlePause}
          style={{ 
            width: '100%', 
            height: 'auto',
            backgroundColor: 'black',
            borderRadius: 'inherit'
          }}
          {...props}
        >
          {/* Primary HLS source for Mux */}
          <source 
            src={videoSrc} 
            type="application/x-mpegURL" 
          />
          
          {/* MP4 fallback for better compatibility */}
          <source 
            src={`https://stream.mux.com/${playbackId}/high.mp4`} 
            type="video/mp4" 
          />
          
          {/* Medium quality MP4 fallback */}
          <source 
            src={`https://stream.mux.com/${playbackId}/medium.mp4`} 
            type="video/mp4" 
          />
          
          {/* Low quality MP4 fallback */}
          <source 
            src={`https://stream.mux.com/${playbackId}/low.mp4`} 
            type="video/mp4" 
          />
          
          <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.900', color: 'white' }}>
            <Typography variant="body2">
              Your browser does not support this video format.
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              Please try using a modern browser like Chrome, Firefox, or Safari.
            </Typography>
          </Box>
        </video>
      ) : (
        <Alert severity="warning" sx={{ m: 2 }}>
          Video source not available. Please check the playback ID.
        </Alert>
      )}
      
      {/* Optional title overlay */}
      {title && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            color: 'white',
            p: 2,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '&:hover': {
              opacity: 1
            }
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      )}
    </Box>
  );
});

MuxVideoPlayer.displayName = 'MuxVideoPlayer';

export default MuxVideoPlayer;
