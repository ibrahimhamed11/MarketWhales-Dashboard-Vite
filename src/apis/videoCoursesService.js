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
  // Get course videos (user view) - uses admin endpoint for now
  getCourseVideos: async (courseId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.USER_VIDEOS.COURSE_VIDEOS(courseId),
        REQUEST_CONFIG.json()
      );
      
      // Handle response structure - return videos array if available
      if (response.data && response.data.videos && Array.isArray(response.data.videos)) {
        return response.data.videos;
      } else {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  // Get video details for user - uses admin endpoint
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
