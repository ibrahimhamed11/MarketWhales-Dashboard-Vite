import React from 'react';
import { videoService } from '../../apis/mux/videoApi';
import MuxVideoPlayer from '../courses/MuxVideoPlayer';

const VideoPlayer = ({ videoId, onProgress, onComplete }) => {
  const handleProgress = (currentTime, duration) => {
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    
    // Update progress every 10 seconds
    if (Math.floor(currentTime) % 10 === 0) {
      videoService.updateWatchProgress(videoId, Math.floor(currentTime), false);
      onProgress?.(Math.floor(currentTime), Math.floor(duration), progress);
    }
  };

  const handleComplete = (duration) => {
    videoService.updateWatchProgress(videoId, Math.floor(duration), true);
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
