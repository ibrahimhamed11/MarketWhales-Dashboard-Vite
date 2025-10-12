import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { videoService } from '../../apis/mux/videoApi';
import { formatDuration } from '../../utils/courses/videoUtils';

const PlayerCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 24px;
`;

const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
`;

const PlayerTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const VideoContainer = styled.div`
  position: relative;
  background: black;
  min-height: 400px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  flex-direction: column;
  gap: 16px;
  color: white;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  padding: 24px;
  background: #ffebee;
  border: 1px solid #f44336;
  color: #c62828;
  text-align: center;
`;

const VideoElement = styled.video`
  width: 100%;
  height: auto;
  min-height: 400px;
  background: black;
`;

const VideoInfo = styled.div`
  padding: 16px;
  background: #f8f9fa;
`;

const VideoTitle = styled.h4`
  margin: 0 0 8px 0;
  font-weight: 600;
  color: #333;
`;

const VideoDescription = styled.p`
  margin: 0 0 16px 0;
  color: #666;
  line-height: 1.5;
`;

const ChipContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Chip = styled.span`
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 16px;
  font-weight: 500;
  background: ${props => props.success ? '#e8f5e8' : '#e3f2fd'};
  color: ${props => props.success ? '#2e7d32' : '#1976d2'};
`;

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
    <PlayerCard>
      <PlayerHeader>
        <PlayerTitle style={{ fontFamily: getFontFamily(video.title) }}>
          {video.title}
        </PlayerTitle>
        <CloseButton onClick={onClose}>
          ←
        </CloseButton>
      </PlayerHeader>
      
      <VideoContainer>
        {loading && (
          <LoadingContainer>
            <Spinner />
            <span>Loading video...</span>
          </LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            {error}
          </ErrorContainer>
        )}

        {streamData && !loading && !error && (
          <VideoElement
            controls
            autoPlay
            playsInline
          >
            <source src={streamData.streamUrl} type="application/x-mpegURL" />
            <source src={streamData.streamUrl?.replace('.m3u8', '.mp4')} type="video/mp4" />
            Your browser does not support this video format.
          </VideoElement>
        )}
      </VideoContainer>
      
      <VideoInfo>
        <VideoTitle>{video.title}</VideoTitle>
        <VideoDescription>
          {video.description || 'No description provided'}
        </VideoDescription>
        <ChipContainer>
          <Chip>Order: {video.order}</Chip>
          <Chip>{formatDuration(video.duration)}</Chip>
          <Chip success={video.isActive}>
            {video.isActive ? 'Active' : 'Inactive'}
          </Chip>
        </ChipContainer>
      </VideoInfo>
    </PlayerCard>
  );
};

export default InlineVideoPlayer;
