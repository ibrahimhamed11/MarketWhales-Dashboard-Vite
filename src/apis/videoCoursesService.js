/**
 * Unified Video and Courses API Service
 * Consolidates all course and video-related API calls
 */

import axiosInstance from './axios';
import { API_ENDPOINTS, REQUEST_CONFIG, getAuthToken } from './config';

// ========================
// COURSE MANAGEMENT APIs
// ========================

export const courseAPI = {
  // Get all courses
  getAll: async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.COURSES.BASE,
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get course by ID
  getById: async (courseId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.COURSES.BY_ID(courseId),
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new course
  create: async (courseData) => {
    try {
      const formData = new FormData();
      
      // Append course data to FormData
      Object.keys(courseData).forEach(key => {
        const value = courseData[key];
        if (value !== undefined && value !== null) {
          if (key === 'vip' && typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, value);
          }
        }
      });

      const response = await axiosInstance.post(
        API_ENDPOINTS.COURSES.BASE,
        formData,
        REQUEST_CONFIG.formData()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update course
  update: async (courseId, courseData) => {
    try {
      const formData = new FormData();
      
      // Append course data to FormData
      Object.keys(courseData).forEach(key => {
        const value = courseData[key];
        if (value !== undefined && value !== null) {
          if (key === 'vip' && typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, value);
          }
        }
      });

      const response = await axiosInstance.put(
        API_ENDPOINTS.COURSES.BY_ID(courseId),
        formData,
        REQUEST_CONFIG.formData()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete course
  delete: async (courseId) => {
    try {
      const response = await axiosInstance.delete(
        API_ENDPOINTS.COURSES.DELETE(courseId),
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ========================
// ADMIN VIDEO MANAGEMENT APIs
// ========================

export const adminVideoAPI = {
  // Upload video directly
  uploadVideo: async (courseId, formData, onProgress) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ADMIN_VIDEOS.UPLOAD(courseId),
        formData,
        REQUEST_CONFIG.upload(onProgress)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload video by URL (for migration or external videos)
  uploadByUrl: async (courseId, videoData) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ADMIN_VIDEOS.UPLOAD_BY_URL(courseId),
        videoData,
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },



  // Get course videos (admin view)
  getCourseVideos: async (courseId, includeInactive = false) => {
    try {
      const endpoint = includeInactive 
        ? `${API_ENDPOINTS.ADMIN_VIDEOS.COURSE_VIDEOS(courseId)}?includeInactive=true`
        : API_ENDPOINTS.ADMIN_VIDEOS.COURSE_VIDEOS(courseId);
      
      console.log(`Calling admin videos endpoint: ${endpoint}`);
      const response = await axiosInstance.get(endpoint, REQUEST_CONFIG.json());
      
      // The API returns { success: true, videos: [...] } but components expect videos array directly
      if (response.data && response.data.videos && Array.isArray(response.data.videos)) {
        console.log(`Successfully loaded ${response.data.videos.length} videos for course ${courseId}`);
        return response.data.videos;
      } else {
        console.warn(`Unexpected response structure:`, response.data);
        return response.data;
      }
    } catch (error) {
      console.error(`Failed to get course videos for courseId ${courseId}:`, {
        endpoint: API_ENDPOINTS.ADMIN_VIDEOS.COURSE_VIDEOS(courseId),
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
      throw error;
    }
  },

  // Get video by ID and details (combined endpoint)
  getVideoById: async (videoId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.ADMIN_VIDEOS.VIDEO_BY_ID(videoId),
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get video details (alias for getVideoById)
  getVideoDetails: async (videoId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.ADMIN_VIDEOS.VIDEO_BY_ID(videoId),
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check video upload/processing status
  getVideoStatus: async (videoId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.ADMIN_VIDEOS.VIDEO_STATUS(videoId),
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get admin video stream
  getVideoStream: async (videoId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.ADMIN_VIDEOS.VIDEO_STREAM(videoId),
        REQUEST_CONFIG.video()
      );
      return response.data;
    } catch (error) {
      // Try POST method with additional data for secure streaming
      if (error.response?.status === 404 || error.response?.status === 405) {
        try {
          const response = await axiosInstance.post(
            API_ENDPOINTS.ADMIN_VIDEOS.VIDEO_STREAM(videoId),
            {
              watchTime: 0,
              deviceFingerprint: 'admin-preview',
              userAgent: navigator.userAgent,
              timestamp: Date.now()
            },
            REQUEST_CONFIG.video()
          );
          return response.data;
        } catch (postError) {
          throw postError;
        }
      }
      throw error;
    }
  },

  // Update video details
  updateVideo: async (videoId, updateData) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.ADMIN_VIDEOS.VIDEO_BY_ID(videoId),
        updateData,
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },



  // Delete video
  deleteVideo: async (videoId) => {
    try {
      const response = await axiosInstance.delete(
        API_ENDPOINTS.ADMIN_VIDEOS.VIDEO_BY_ID(videoId),
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reorder videos
  reorderVideos: async (courseId, videoOrders) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.ADMIN_VIDEOS.REORDER_VIDEOS(courseId),
        { videoOrders },
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },



  // Get Mux service status
  getMuxStatus: async () => {
    try {
      // Temporarily return mock data until backend is fixed
      console.warn('MUX status endpoint disabled - backend route conflict');
      return {
        service: 'Mux Video Service',
        status: 'disabled',
        message: 'MUX status endpoint temporarily disabled due to route conflicts',
        statistics: {
          totalVideos: 0,
          muxVideos: 0,
          s3Videos: 0,
          migrationProgress: 0
        }
      };
    } catch (error) {
      console.error('MUX status error:', error);
      throw error;
    }
  },


};

// ========================
// USER VIDEO ACCESS APIs
// ========================

export const userVideoAPI = {
  // Get course videos (user view) - uses USER endpoint
  getCourseVideos: async (courseId) => {
    try {
      console.log('[USER API] Fetching course videos for courseId:', courseId);
      console.log('[USER API] Using endpoint:', API_ENDPOINTS.USER_VIDEOS.COURSE_VIDEOS(courseId));
      
      const response = await axiosInstance.get(
        API_ENDPOINTS.USER_VIDEOS.COURSE_VIDEOS(courseId),
        REQUEST_CONFIG.json()
      );
      
      console.log('[USER API] Raw response:', response.data);
      
      // Handle response structure - return videos array if available
      if (response.data && response.data.videos && Array.isArray(response.data.videos)) {
        console.log('[USER API] Returning videos array with', response.data.videos.length, 'videos');
        return response.data.videos;
      } else if (response.data && Array.isArray(response.data)) {
        console.log('[USER API] Response is already an array with', response.data.length, 'videos');
        return response.data;
      } else {
        console.warn('[USER API] Unexpected response structure, returning as-is:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error(`[USER API] Failed to get user course videos for courseId ${courseId}:`, {
        endpoint: API_ENDPOINTS.USER_VIDEOS.COURSE_VIDEOS(courseId),
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
      throw error;
    }
  },

  // Get video details for user - uses USER endpoint
  getVideoDetails: async (videoId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.USER_VIDEOS.VIDEO_DETAILS(videoId),
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to get user video details for videoId ${videoId}:`, {
        endpoint: API_ENDPOINTS.USER_VIDEOS.VIDEO_DETAILS(videoId),
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
      throw error;
    }
  },

  // Get secure video stream URL for user (uses POST as per backend)
  getVideoStream: async (videoId, streamData = {}) => {
    try {
      const requestData = {
        watchTime: streamData.watchTime || 0,
        deviceFingerprint: streamData.deviceFingerprint || 'web-dashboard',
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        ...streamData
      };
      
      const response = await axiosInstance.post(
        API_ENDPOINTS.USER_VIDEOS.VIDEO_STREAM(videoId),
        requestData,
        REQUEST_CONFIG.video()
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to get user video stream for videoId ${videoId}:`, {
        endpoint: API_ENDPOINTS.USER_VIDEOS.VIDEO_STREAM(videoId),
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
      throw error;
    }
  },

  // Get video stream URL (alternative endpoint)
  getVideoStreamUrl: async (videoId, streamData = {}) => {
    try {
      const requestData = {
        watchTime: streamData.watchTime || 0,
        deviceFingerprint: streamData.deviceFingerprint || 'web-dashboard',
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        ...streamData
      };
      
      const response = await axiosInstance.post(
        API_ENDPOINTS.USER_VIDEOS.VIDEO_STREAM_URL(videoId),
        requestData,
        REQUEST_CONFIG.video()
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to get user video stream URL for videoId ${videoId}:`, {
        endpoint: API_ENDPOINTS.USER_VIDEOS.VIDEO_STREAM_URL(videoId),
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
      throw error;
    }
  },

  // Update video watch progress
  updateWatchProgress: async (videoId, progressData) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.USER_VIDEOS.VIDEO_PROGRESS(videoId),
        progressData,
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      // Fallback to POST if PUT fails
      try {
        const response = await axiosInstance.post(
          API_ENDPOINTS.USER_VIDEOS.VIDEO_PROGRESS(videoId),
          progressData,
          REQUEST_CONFIG.json()
        );
        return response.data;
      } catch (postError) {
        console.error(`Failed to update watch progress for videoId ${videoId}:`, {
          endpoint: API_ENDPOINTS.USER_VIDEOS.VIDEO_PROGRESS(videoId),
          status: postError.response?.status,
          message: postError.response?.data?.error || postError.message
        });
        throw postError;
      }
    }
  },

  // Get course watch progress
  getCourseProgress: async (courseId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.USER_VIDEOS.COURSE_PROGRESS(courseId),
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to get course progress for courseId ${courseId}:`, {
        endpoint: API_ENDPOINTS.USER_VIDEOS.COURSE_PROGRESS(courseId),
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
      throw error;
    }
  },

  // Refresh video token
  refreshVideoToken: async (tokenData) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.USER_VIDEOS.REFRESH_TOKEN,
        tokenData,
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      console.error('Failed to refresh video token:', error);
      throw error;
    }
  },

  // Validate access token
  validateAccessToken: async (tokenData) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.USER_VIDEOS.VALIDATE_TOKEN,
        tokenData,
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      console.error('Failed to validate access token:', error);
      throw error;
    }
  },

  // Get video manifest
  getVideoManifest: async (videoId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.USER_VIDEOS.VIDEO_MANIFEST(videoId),
        REQUEST_CONFIG.video()
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to get video manifest for videoId ${videoId}:`, error);
      throw error;
    }
  },

  // Get video playlist for course
  getVideoPlaylist: async (courseId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.USER_VIDEOS.VIDEO_PLAYLIST(courseId),
        REQUEST_CONFIG.json()
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to get video playlist for courseId ${courseId}:`, error);
      throw error;
    }
  },
};

// ========================
// LEGACY MUX FUNCTIONS (Redirected to adminVideoAPI)
// ========================

export const muxAPI = {
  // Legacy functions that now use adminVideoAPI
  uploadByUrl: adminVideoAPI.uploadByUrl,
  checkUploadStatus: adminVideoAPI.getVideoStatus,
  getCourseVideos: adminVideoAPI.getCourseVideos,
  updateVideo: adminVideoAPI.updateVideo,
  deleteVideo: adminVideoAPI.deleteVideo,
  reorderVideos: adminVideoAPI.reorderVideos,
  getStatus: adminVideoAPI.getMuxStatus,
};

// ========================
// ERROR HANDLING UTILITIES
// ========================

export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);

  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        return 'Authentication required. Please log in again.';
      case 403:
        return 'Access denied. You don\'t have permission to access this content.';
      case 404:
        return 'Content not found.';
      case 429:
        return 'Too many requests. Please wait and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data?.error || data?.message || defaultMessage;
    }
  } else if (error.request) {
    return 'Network error. Please check your connection and try again.';
  } else {
    return error.message || defaultMessage;
  }
};

// ========================
// LEGACY SUPPORT FUNCTIONS
// ========================

// For backward compatibility
export const getAllcourses = courseAPI.getAll;
export const deletecourse = courseAPI.delete;
export const addcourse = courseAPI.create;
export const updateCourse = courseAPI.update;

// Main export
export default {
  courseAPI,
  adminVideoAPI,
  userVideoAPI,
  muxAPI,
  handleApiError,
  // Legacy exports
  getAllcourses,
  deletecourse,
  addcourse,
  updateCourse,
};
