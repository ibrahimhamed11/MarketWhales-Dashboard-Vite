import React, { useState, useEffect } from 'react';
import { videoService } from '../apis/mux/videoApi';

const playerContainerStyle = {
  position: 'relative',
  width: '100%',
  background: 'black',
  borderRadius: '8px',
  overflow: 'hidden'
};

const loadingContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px',
  flexDirection: 'column',
  gap: '16px',
  color: 'white'
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '3px solid rgba(255, 255, 255, 0.3)',
  borderTop: '3px solid white',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const errorContainerStyle = {
  background: '#ffebee',
  border: '1px solid #f44336',
  color: '#c62828',
  padding: '16px',
  borderRadius: '8px',
  textAlign: 'center'
};

const videoElementStyle = {
  width: '100%',
  height: 'auto',
  minHeight: '300px',
  background: 'black'
};

// Add CSS for spinner animation
const spinnerKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject the keyframes into the document head if not already present
if (!document.querySelector('#spinner-keyframes')) {
  const style = document.createElement('style');
  style.id = 'spinner-keyframes';
  style.textContent = spinnerKeyframes;
  document.head.appendChild(style);
}

// Simple Mux player component
const MuxPlayerComponent = ({ 
  videoId, 
  onProgress, 
  onError,
  onEnded,
  autoPlay = false
}) => {
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (videoId) {
      loadVideoStream();
    }
  }, [videoId]);

  const loadVideoStream = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await videoService.getAdminVideoStream(videoId);
      setStreamData(data);
    } catch (err) {
      console.error('Error loading video stream:', err);
      setError('Failed to load video');
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProgress = (event) => {
    if (onProgress) {
      onProgress({
        currentTime: event.target.currentTime,
        duration: event.target.duration,
        played: event.target.currentTime / event.target.duration
      });
    }
  };

  const handleEnded = () => {
    onEnded?.();
  };

  return (
    <div style={playerContainerStyle}>
      {loading && (
        <div style={loadingContainerStyle}>
          <div style={spinnerStyle} />
          <span>Loading video...</span>
        </div>
      )}
      
      {error && (
        <div style={errorContainerStyle}>
          {error}
        </div>
      )}
      
      {streamData && !loading && !error && (
        <video
          style={videoElementStyle}
          controls
          autoPlay={autoPlay}
          onTimeUpdate={handleProgress}
          onEnded={handleEnded}
          playsInline
        >
          <source src={streamData.streamUrl} type="application/x-mpegURL" />
          <source src={streamData.streamUrl?.replace('.m3u8', '.mp4')} type="video/mp4" />
          Your browser does not support this video format.
        </video>
      )}
    </div>
  );
};

export default MuxPlayerComponent;
