import { useState, useCallback, useEffect } from 'react';
import { adminVideoAPI, userVideoAPI, handleApiError } from '../apis/videoCoursesService';

const useVideoStream = (videoId, isAdminMode = false) => {
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

      let videoResponse;
      let streamResponse;

      // Get video details
      if (isAdminMode) {
        videoResponse = await adminVideoAPI.getVideoDetails(videoId);
        // Get admin stream URL
        streamResponse = await adminVideoAPI.getVideoStream(videoId);
      } else {
        videoResponse = await userVideoAPI.getVideoDetails(videoId);
        // Generate device fingerprint for user stream
        const deviceFingerprint = `${navigator.userAgent}-${Date.now()}`;
        streamResponse = await userVideoAPI.getVideoStreamUrl(videoId, deviceFingerprint);
      }

      const videoDetails = videoResponse.data || videoResponse;
      const streamData = streamResponse.data || streamResponse;

      const processedVideoData = {
        id: videoId,
        title: videoDetails.title || `Video ${videoId}`,
        description: videoDetails.description || '',
        streamUrl: streamData.streamUrl || streamData.url,
        thumbnailUrl: videoDetails.thumbnailUrl || streamData.thumbnailUrl,
        duration: videoDetails.duration || 0,
        status: videoDetails.status || streamData.status || 'ready',
        quality: streamData.quality || ['720p', '480p', '360p'],
        captions: videoDetails.captions || [],
        metadata: {
          width: videoDetails.width || streamData.width || 1280,
          height: videoDetails.height || streamData.height || 720,
          fps: videoDetails.fps || 30,
          codec: videoDetails.codec || 'h264'
        },
        playbackId: videoDetails.playbackId || streamData.playbackId,
        order: videoDetails.order,
        courseId: videoDetails.courseId,
      };

      setVideoData(processedVideoData);
      setPlaybackState(prev => ({
        ...prev,
        duration: processedVideoData.duration
      }));
    } catch (err) {
      console.error('Error fetching video data:', err);
      const errorMessage = handleApiError(err, 'Failed to load video');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [videoId, isAdminMode]);

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
      if (isAdminMode) {
        // Admin analytics tracking could be different
        console.log('Admin tracking video view for:', videoId);
      } else {
        // Track user video view
        console.log('Tracking video view for:', videoId);
      }
    } catch (err) {
      console.error('Error tracking video view:', err);
    }
  }, [videoId, isAdminMode]);

  const trackProgress = useCallback(async (watchTime, completed = false) => {
    try {
      // Progress tracking not implemented yet - just log for now
      console.log(`Video progress: ${watchTime}s, completed: ${completed}`);
      // TODO: Implement progress tracking when backend endpoints are available
    } catch (err) {
      console.error('Error tracking video progress:', err);
    }
  }, [videoId, isAdminMode]);

  const trackCompletion = useCallback(async () => {
    try {
      const watchTime = playbackState.duration;
      await trackProgress(watchTime, true);
      console.log('Video completion tracked for:', videoId);
    } catch (err) {
      console.error('Error tracking video completion:', err);
    }
  }, [videoId, playbackState.duration, trackProgress]);

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
