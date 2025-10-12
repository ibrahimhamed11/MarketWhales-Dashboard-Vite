import axiosInstance from "../axios";

// Get token from localStorage
const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

// ========================
// Course Management APIs
// ========================

export const courseAPI = {
  // Get all courses with sales data
  getAllCourses: async () => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.get('/courses/', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.get(`/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new course
  createCourse: async (formData) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.post('/courses/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update course
  updateCourse: async (courseId, formData) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.put(`/courses/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete course
  deleteCourse: async (courseId) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.delete(`/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// ========================
// Admin Video Management APIs
// ========================

export const adminVideoAPI = {
  // Upload video directly
  uploadVideo: async (courseId, formData, onProgress) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.post(
        `/admin/videos/courses/${courseId}/videos/upload`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.lengthComputable) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percentCompleted);
            }
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get presigned URL for large file uploads
  getPresignedUrl: async (courseId, filename, contentType) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.post(
        `/admin/videos/courses/${courseId}/videos/presigned-url`,
        {
          filename,
          contentType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Confirm upload after using presigned URL
  confirmUpload: async (courseId, uploadData) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.post(
        `/admin/videos/courses/${courseId}/videos/confirm-upload`,
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get course videos (admin view)
  getCourseVideos: async (courseId, includeInactive = false) => {
    try {
      const token = getTokenFromLocalStorage();
      const params = includeInactive ? '?includeInactive=true' : '';
      const response = await axiosInstance.get(
        `/admin/videos/courses/${courseId}/videos${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update video details
  updateVideo: async (videoId, updateData) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.put(
        `/admin/videos/videos/${videoId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update video metadata (for quick updates like isActive)
  updateVideoMetadata: async (videoId, metadata) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.patch(
        `/admin/videos/videos/${videoId}/metadata`,
        metadata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete video
  deleteVideo: async (videoId) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.delete(`/admin/videos/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reorder videos
  reorderVideos: async (courseId, videoOrders) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.put(
        `/admin/videos/courses/${courseId}/videos/reorder`,
        { videoOrders },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get admin video stream
  getAdminVideoStream: async (videoId) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.get(`/admin/videos/videos/${videoId}/stream`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get video analytics
  getVideoAnalytics: async (videoId) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.get(`/admin/videos/videos/${videoId}/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if admin video stream is available (for testing/demo purposes)
  checkAdminVideoStreamAvailability: async (videoId) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.head(
        `/admin/videos/videos/${videoId}/stream`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return { available: true, status: response.status };
    } catch (error) {
      return { 
        available: false, 
        status: error.response?.status || 0,
        message: error.response?.statusText || error.message
      };
    }
  }
};

// ========================
// User Video Access APIs
// ========================

export const userVideoAPI = {
  // Get course videos (user view)
  getCourseVideos: async (courseId) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.get(`/user/videos/courses/${courseId}/videos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get video details
  getVideoDetails: async (videoId) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.get(`/admin/videos/videos/${videoId}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if video stream is available (for testing/demo purposes)
  checkVideoStreamAvailability: async (videoId) => {
    try {
      const token = getTokenFromLocalStorage();
      
      // Prepare headers with required API key
      const headers = {
        Authorization: `Bearer ${token}`,
        'X-Video-Provider': 'mux',
        'X-Client-Type': 'web-dashboard'
      };

      // Add Mux environment key if configured (optional for frontend)
      const muxEnvKey = process.env.REACT_APP_MUX_ENV_KEY;
      if (muxEnvKey) {
        headers['X-Mux-Env-Key'] = muxEnvKey;
      }

      const response = await axiosInstance.head(
        `/admin/videos/videos/${videoId}/stream`,
        { headers }
      );
      return { available: true, status: response.status };
    } catch (error) {
      return { 
        available: false, 
        status: error.response?.status || 0,
        message: error.response?.statusText || error.message
      };
    }
  },

  // Get secure video stream
  getSecureVideoStream: async (videoId, watchTime = 0, deviceFingerprint) => {
    try {
      const token = getTokenFromLocalStorage();
      
      // Prepare headers with required API key
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Session-Id': Math.random().toString(36).substring(2, 15),
        'X-Origin': window.location.origin,
        'X-Video-Provider': 'mux',
        'X-Client-Type': 'web-dashboard'
      };

      // Add Mux environment key if configured (optional for frontend)
      const muxEnvKey = process.env.REACT_APP_MUX_ENV_KEY;
      if (muxEnvKey) {
        headers['X-Mux-Env-Key'] = muxEnvKey;
      }

      const response = await axiosInstance.post(
        `/admin/videos/videos/${videoId}/stream`,
        {
          watchTime,
          deviceFingerprint,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        },
        { headers }
      );
      return response.data;
    } catch (error) {
      // Enhanced error handling for video streaming
      if (error.response?.status === 404) {
        throw new Error(`Video stream not found for video ${videoId}. The video may not be uploaded or the stream endpoint may not be configured.`);
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied to this video stream.');
      } else if (error.response?.data?.error?.includes('No value provided for input HTTP label: Key')) {
        throw new Error('Video streaming service configuration error. Please contact support.');
      } else if (error.response?.data?.error) {
        throw new Error(`Video streaming error: ${error.response.data.error}`);
      }
      
      console.error('Video stream error:', error);
      throw error;
    }
  },

  // Refresh video token
  refreshVideoToken: async (refreshToken, videoId, deviceFingerprint) => {
    try {
      const token = getTokenFromLocalStorage();
      
      // Prepare headers with required API key
      const headers = {
        Authorization: `Bearer ${token}`,
        'X-Video-Provider': 'mux',
        'X-Client-Type': 'web-dashboard'
      };

      // Add Mux environment key if configured (optional for frontend)
      const muxEnvKey = process.env.REACT_APP_MUX_ENV_KEY;
      if (muxEnvKey) {
        headers['X-Mux-Env-Key'] = muxEnvKey;
      }

      const response = await axiosInstance.post('/admin/videos/videos/refresh-token', {
        refreshToken,
        videoId,
        deviceFingerprint
      }, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update watch progress
  updateWatchProgress: async (videoId, watchTime, completed = false) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.put(
        `/admin/videos/videos/${videoId}/progress`,
        {
          watchTime,
          completed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get watch progress
  getWatchProgress: async (courseId) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.get(`/user/videos/courses/${courseId}/progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get video playlist
  getVideoPlaylist: async (courseId) => {
    try {
      const token = getTokenFromLocalStorage();
      const response = await axiosInstance.get(`/user/videos/courses/${courseId}/videos/playlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// ========================
// Error Handler Utility
// ========================

export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);

  if (error.response) {
    // Server responded with error status
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
    // Network error
    return 'Network error. Please check your connection and try again.';
  } else {
    // Other error
    return error.message || defaultMessage;
  }
};
