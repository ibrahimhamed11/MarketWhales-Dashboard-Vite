import { useState, useCallback, useEffect } from 'react';
import { videoService } from '../apis/mux/videoApi';

const useVideoStream = (videoId) => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playbackState, setPlaybackState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    fullscreen: false
  });

  // Fetch video stream data
  const fetchVideoData = useCallback(async () => {
    if (!videoId) return;

    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual video service call
      const mockVideoData = {
        id: videoId,
        title: `Video ${videoId}`,
        description: 'Sample video description',
        streamUrl: `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`,
        thumbnailUrl: null,
        duration: 630, // seconds
        status: 'ready',
        quality: ['720p', '480p', '360p'],
        captions: [],
        metadata: {
          width: 1280,
          height: 720,
          fps: 30,
          codec: 'h264'
        }
      };

      setVideoData(mockVideoData);
      setPlaybackState(prev => ({
        ...prev,
        duration: mockVideoData.duration
      }));
    } catch (err) {
      console.error('Error fetching video data:', err);
      setError(err.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  // Playback controls
  const play = useCallback(() => {
    setPlaybackState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setPlaybackState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlay = useCallback(() => {
    setPlaybackState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const seek = useCallback((time) => {
    setPlaybackState(prev => ({ ...prev, currentTime: Math.max(0, Math.min(time, prev.duration)) }));
  }, []);

  const setVolume = useCallback((volume) => {
    setPlaybackState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const toggleMute = useCallback(() => {
    setPlaybackState(prev => ({ ...prev, muted: !prev.muted }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setPlaybackState(prev => ({ ...prev, fullscreen: !prev.fullscreen }));
  }, []);

  // Update current time (would typically be called by video player)
  const updateCurrentTime = useCallback((time) => {
    setPlaybackState(prev => ({ ...prev, currentTime: time }));
  }, []);

  // Video analytics tracking
  const trackView = useCallback(async () => {
    try {
      // TODO: Track video view
      console.log('Tracking video view for:', videoId);
    } catch (err) {
      console.error('Error tracking video view:', err);
    }
  }, [videoId]);

  const trackProgress = useCallback(async (progress) => {
    try {
      // TODO: Track video progress
      console.log('Tracking video progress:', progress, 'for video:', videoId);
    } catch (err) {
      console.error('Error tracking video progress:', err);
    }
  }, [videoId]);

  const trackCompletion = useCallback(async () => {
    try {
      // TODO: Track video completion
      console.log('Tracking video completion for:', videoId);
    } catch (err) {
      console.error('Error tracking video completion:', err);
    }
  }, [videoId]);

  // Format time helper
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Calculate progress percentage
  const progress = playbackState.duration > 0 ? (playbackState.currentTime / playbackState.duration) * 100 : 0;

  useEffect(() => {
    fetchVideoData();
  }, [fetchVideoData]);

  return {
    videoData,
    loading,
    error,
    playbackState,
    progress,
    controls: {
      play,
      pause,
      togglePlay,
      seek,
      setVolume,
      toggleMute,
      toggleFullscreen,
      updateCurrentTime
    },
    analytics: {
      trackView,
      trackProgress,
      trackCompletion
    },
    utils: {
      formatTime
    },
    actions: {
      fetchVideoData
    }
  };
};

export default useVideoStream;
