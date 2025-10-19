import React from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { Box, Alert, CircularProgress, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { videoService } from '../../apis/mux/videoApi';
import { generateDeviceFingerprint } from '../../utils/courses/videoUtils';

// Single, clean Mux player component
const MuxVideoPlayer = ({ 
  videoId, 
  onProgress, 
  onError,
  onEnded,
  autoPlay = false, 
  style = {},
  userMode = false, // New prop to determine API usage
  ...props 
}) => {
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (videoId) {
      loadVideoStream();
    }
  }, [videoId, userMode]);

  const loadVideoStream = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      
      if (userMode) {
        // User mode: Use ONLY user video APIs
        console.log('[MuxVideoPlayer] Loading video in USER mode for videoId:', videoId);
        const deviceFingerprint = generateDeviceFingerprint();
        data = await videoService.getUserVideoStream(videoId, deviceFingerprint);
        console.log('[MuxVideoPlayer] USER stream data received:', data);
      } else {
        // Admin mode: Use admin APIs
        console.log('[MuxVideoPlayer] Loading video in ADMIN mode for videoId:', videoId);
        data = await videoService.getAdminVideoStream(videoId);
        console.log('[MuxVideoPlayer] ADMIN stream data received:', data);
      }
      
      setStreamData(data);
    } catch (err) {
      console.error('Error loading video stream:', err);
      setError(err.message || 'Failed to load video');
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        minHeight={300}
        bgcolor="black"
        borderRadius={2}
        style={style}
      >
        <Box textAlign="center" color="white">
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography>Loading video...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={style}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!streamData?.streamUrl) {
    return (
      <Box style={style}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          No video stream available
        </Alert>
      </Box>
    );
  }

  return (
    <MuxPlayer
      streamType="on-demand"
      src={streamData.streamUrl}
      poster={streamData.video?.thumbnailUrl}
      metadata={{
        video_id: streamData.video?.id || videoId,
        video_title: streamData.video?.title || 'Video'
      }}
      autoPlay={autoPlay}
      style={{
        width: '100%',
        aspectRatio: '16/9',
        borderRadius: '8px',
        ...style
      }}
      onTimeUpdate={(e) => {
        const currentTime = e.target.currentTime;
        const duration = e.target.duration;
        if (currentTime && duration && onProgress) {
          onProgress(currentTime, duration);
        }
      }}
      onEnded={(e) => {
        const duration = e.target.duration;
        if (duration && onEnded) {
          onEnded(duration);
        }
      }}
      onError={(e) => {
        console.error('MuxPlayer error:', e);
        onError?.(e);
      }}
      playsInline
      {...props}
    />
  );
};

export default MuxVideoPlayer;
