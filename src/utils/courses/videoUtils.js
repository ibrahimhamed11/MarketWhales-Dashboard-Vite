// ========================
// Device Fingerprinting Utility
// ========================

export const generateDeviceFingerprint = () => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    
    const fingerprint = [
      navigator.userAgent || '',
      navigator.language || '',
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
      navigator.hardwareConcurrency || 0,
      navigator.deviceMemory || 0,
      navigator.platform || '',
      navigator.cookieEnabled ? 'true' : 'false'
    ].join('|');
    
    return btoa(fingerprint).substring(0, 32);
  } catch (error) {
    console.error('Error generating device fingerprint:', error);
    return Math.random().toString(36).substring(2, 32);
  }
};

// ========================
// Session ID Generator
// ========================

export const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// ========================
// Video Format Utilities
// ========================

export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getVideoQualityLabel = (resolution) => {
  const qualityMap = {
    '1920x1080': 'Full HD (1080p)',
    '1280x720': 'HD (720p)',
    '854x480': 'SD (480p)',
    '640x360': 'Low (360p)'
  };
  
  return qualityMap[resolution] || resolution;
};

// ========================
// Progress Calculation Utilities
// ========================

export const calculateProgress = (watchTime, duration) => {
  if (!watchTime || !duration || duration === 0) return 0;
  return Math.min((watchTime / duration) * 100, 100);
};

export const isVideoCompleted = (watchTime, duration, threshold = 0.9) => {
  if (!watchTime || !duration || duration === 0) return false;
  return (watchTime / duration) >= threshold;
};

export const calculateCourseProgress = (videos) => {
  if (!videos || videos.length === 0) return { completed: 0, total: 0, percentage: 0 };
  
  const completedVideos = videos.filter(video => 
    video.progress && video.progress.completed
  ).length;
  
  return {
    completed: completedVideos,
    total: videos.length,
    percentage: Math.round((completedVideos / videos.length) * 100)
  };
};

// ========================
// Validation Utilities
// ========================

export const validateVideoFile = (file) => {
  const errors = [];
  
  // Check if file exists
  if (!file) {
    errors.push('Please select a video file');
    return errors;
  }
  
  // Check file type
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/mov', 'video/avi'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Please select a valid video file (MP4, WebM, OGG, MOV, AVI)');
  }
  
  // Check file size (500MB limit)
  const maxSize = 500 * 1024 * 1024; // 500MB in bytes
  if (file.size > maxSize) {
    errors.push('Video file size must be less than 500MB');
  }
  
  return errors;
};

export const validateImageFile = (file) => {
  const errors = [];
  
  if (file) {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Please select a valid image file (JPEG, PNG, WebP)');
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      errors.push('Image file size must be less than 10MB');
    }
  }
  
  return errors;
};

export const validateCourseData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Course name is required');
  }
  
  if (!data.description || data.description.trim().length === 0) {
    errors.push('Course description is required');
  }
  
  if (!data.type) {
    errors.push('Course type is required');
  }
  
  if (data.type === 'Paid' && (!data.price || isNaN(data.price) || data.price <= 0)) {
    errors.push('Valid price is required for paid courses');
  }
  
  if (!data.courseType) {
    errors.push('Course category is required');
  }
  
  return errors;
};

export const validateVideoData = (data) => {
  const errors = [];
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Video title is required');
  }
  
  if (data.order && (isNaN(data.order) || data.order < 1)) {
    errors.push('Video order must be a positive number');
  }
  
  if (data.duration && (isNaN(data.duration) || data.duration < 0)) {
    errors.push('Duration must be a valid number of seconds');
  }
  
  return errors;
};

// ========================
// Local Storage Utilities
// ========================

export const saveVideoProgress = (videoId, progress) => {
  try {
    const key = `video_progress_${videoId}`;
    const data = {
      ...progress,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving video progress to local storage:', error);
  }
};

export const getVideoProgress = (videoId) => {
  try {
    const key = `video_progress_${videoId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting video progress from local storage:', error);
    return null;
  }
};

export const clearVideoProgress = (videoId) => {
  try {
    const key = `video_progress_${videoId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing video progress from local storage:', error);
  }
};

// ========================
// URL and Path Utilities
// ========================

export const generateVideoThumbnailUrl = (thumbnailKey, baseUrl = '') => {
  if (!thumbnailKey) return null;
  
  // If it's already a full URL, return as is
  if (thumbnailKey.startsWith('http')) {
    return thumbnailKey;
  }
  
  // Construct full URL
  return `${baseUrl}/api/files/${thumbnailKey}`;
};

export const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special characters with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
};

// ========================
// Error Handling Utilities
// ========================

export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('Network Error') ||
         !error?.response;
};

// ========================
// Retry Utilities
// ========================

export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on authentication errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

// ========================
// Mobile & Device Detection Utilities
// ========================

export const isMobileDevice = () => {
  try {
    const userAgent = navigator.userAgent || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad/i.test(userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return {
      isMobile: isMobile && !isTablet,
      isTablet,
      isTouchDevice,
      isIOS: /iPhone|iPad|iPod/i.test(userAgent),
      isAndroid: /Android/i.test(userAgent),
      isSmallScreen: window.innerWidth < 768
    };
  } catch (error) {
    console.error('Error detecting mobile device:', error);
    return {
      isMobile: false,
      isTablet: false,
      isTouchDevice: false,
      isIOS: false,
      isAndroid: false,
      isSmallScreen: false
    };
  }
};

export const canAutoplayVideo = () => {
  const device = isMobileDevice();
  
  // iOS and some mobile browsers block autoplay
  if (device.isIOS) return false;
  if (device.isMobile && device.isAndroid) return false;
  
  // Check if autoplay is supported
  try {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    
    // Check for autoplay support
    const promise = video.play();
    if (promise !== undefined) {
      promise.catch(() => {
        // Autoplay blocked
        return false;
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking autoplay support:', error);
    return false;
  }
};

export const getMobileVideoSettings = () => {
  const device = isMobileDevice();
  
  return {
    playsInline: true,
    preload: device.isMobile ? 'none' : 'metadata',
    autoPlay: false, // Always false for mobile compatibility
    muted: device.isMobile, // Muted by default on mobile for autoplay to work
    controls: true,
    disablePictureInPicture: device.isMobile,
    controlsList: device.isMobile ? 'nodownload nofullscreen noremoteplayback' : 'nodownload noremoteplayback',
    poster: null // Can be set externally
  };
};

// ========================
// Video Error Handling for Mobile
// ========================

export const handleVideoError = (error, videoElement) => {
  const device = isMobileDevice();
  console.error('Video error:', error);
  
  let errorMessage = 'Video playback failed';
  let canRetry = true;
  
  if (videoElement && videoElement.error) {
    switch (videoElement.error.code) {
      case videoElement.error.MEDIA_ERR_ABORTED:
        errorMessage = 'Video playback was aborted';
        canRetry = true;
        break;
        
      case videoElement.error.MEDIA_ERR_NETWORK:
        errorMessage = device.isMobile 
          ? 'Network error. Please check your connection and try again' 
          : 'Network error occurred while loading video';
        canRetry = true;
        break;
        
      case videoElement.error.MEDIA_ERR_DECODE:
        errorMessage = device.isMobile
          ? 'Video format not supported on this device'
          : 'Error decoding video file';
        canRetry = false;
        break;
        
      case videoElement.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMessage = device.isMobile
          ? 'Video format not supported. Please try a different browser'
          : 'Video format not supported by your browser';
        canRetry = false;
        break;
        
      default:
        errorMessage = device.isMobile
          ? 'Playback error. Please try refreshing the page'
          : 'Unknown video error occurred';
        canRetry = true;
    }
  }
  
  // Add device-specific suggestions
  if (device.isMobile && canRetry) {
    errorMessage += '. Try rotating your device or switching to desktop.';
  }
  
  return {
    message: errorMessage,
    canRetry,
    isMobile: device.isMobile,
    suggestion: device.isMobile 
      ? 'For best experience, try using desktop or ensure stable WiFi connection'
      : null
  };
};

// ========================
// Mobile-Specific Video Initialization
// ========================

export const initializeMobileVideo = async (videoElement) => {
  if (!videoElement) return false;
  
  const device = isMobileDevice();
  
  if (device.isMobile) {
    try {
      // Set mobile-optimized attributes
      videoElement.playsInline = true;
      videoElement.preload = 'none';
      videoElement.muted = true; // Required for autoplay on mobile
      
      // Add mobile-specific event listeners
      const handleTouchStart = () => {
        // User interaction detected, can now play
        videoElement.muted = false; // Unmute after user interaction
        videoElement.removeEventListener('touchstart', handleTouchStart);
      };
      
      videoElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      
      // Handle fullscreen for mobile
      if (device.isIOS) {
        videoElement.webkitEnterFullscreen = videoElement.webkitEnterFullscreen || (() => {
          console.warn('Fullscreen not supported on this iOS version');
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error initializing mobile video:', error);
      return false;
    }
  }
  
  return true;
};

// ========================
// Video Loading Strategy for Mobile
// ========================

export const getVideoLoadingStrategy = () => {
  const device = isMobileDevice();
  
  if (device.isMobile) {
    return {
      preload: 'none', // Don't preload on mobile to save bandwidth
      loadingStrategy: 'lazy',
      qualityPreference: 'auto', // Let browser decide
      bufferSize: 'small',
      retryAttempts: 2, // Fewer retries on mobile
      retryDelay: 2000 // Longer delay between retries
    };
  }
  
  return {
    preload: 'metadata',
    loadingStrategy: 'eager',
    qualityPreference: 'high',
    bufferSize: 'normal',
    retryAttempts: 3,
    retryDelay: 1000
  };
};
