import React from 'react';
import { videoService } from '../../apis/mux/videoApi';
import MuxVideoPlayer from '../courses/MuxVideoPlayer';

const VideoPlayer = ({ videoId, onProgress, onComplete }) => {
  const handleProgress = (currentTime, duration) => {
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    
    // Progress tracking disabled - just call the callback
    onProgress?.(Math.floor(currentTime), Math.floor(duration), progress);
  };

  const handleComplete = (duration) => {
    // Progress tracking disabled - just call the callback
    onComplete?.(Math.floor(duration));
  };

  return (
    <MuxVideoPlayer
      videoId={videoId}
      onProgress={handleProgress}
      onEnded={handleComplete}
      style={{ width: '100%', maxWidth: '1000px', aspectRatio: '16/9' }}
    />
  );
};

export default VideoPlayer;
