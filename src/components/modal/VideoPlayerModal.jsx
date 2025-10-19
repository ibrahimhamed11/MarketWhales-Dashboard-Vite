import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  CircularProgress
} from '@mui/material';

import { videoService } from '../../apis/mux/videoApi';
import MuxVideoPlayer from './MuxVideoPlayer';

const VideoPlayerModal = ({ 
  open, 
  onClose, 
  video, 
  isUserMode = false
}) => {
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setLoading(false);
    }
  }, [open]);

  const fetchVideoStream = async () => {
    if (!video?._id) return;
    
    setLoading(true);
    
    try {
      let data;
      
      if (isUserMode) {
        data = await videoService.getUserVideoStream(video._id, 'modal-device');
      } else {
        data = await videoService.getAdminVideoStream(video._id);
      }
      
      setStreamData(data);
    } catch (err) {
      console.error('Error fetching video stream:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogContent sx={{ p: 0, bgcolor: 'black' }}>
        {loading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px'
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!loading && streamData && (
          <Box sx={{ width: '100%', minHeight: '400px' }}>
            <MuxVideoPlayer
              videoId={video?._id}
              userMode={isUserMode}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
