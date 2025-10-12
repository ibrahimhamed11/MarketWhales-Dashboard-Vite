import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://market-whales.onrender.com';

// Create axios instance with auth
const videoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token and API key to requests
videoApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Using existing token key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add video provider headers
  config.headers['X-Video-Provider'] = 'mux';
  config.headers['X-Client-Type'] = 'web-dashboard';
  
  // Add Mux environment key if configured (optional for frontend)
  const muxEnvKey = process.env.REACT_APP_MUX_ENV_KEY;
  if (muxEnvKey) {
    config.headers['X-Mux-Env-Key'] = muxEnvKey;
  }
  
  return config;
});

export const videoService = {
  // Admin: Create direct upload URL
  createDirectUpload: async (courseId, videoData) => {
    const response = await videoApi.post(`/mux/courses/${courseId}/videos/direct-upload`, videoData);
    return response.data;
  },

  // Admin: Upload video by URL (for migration)
  uploadByUrl: async (courseId, videoData) => {
    const response = await videoApi.post(`/mux/courses/${courseId}/videos/upload-by-url`, videoData);
    return response.data;
  },

  // Admin: Check upload status
  checkUploadStatus: async (videoId) => {
    const response = await videoApi.get(`/mux/videos/${videoId}/upload-status`);
    return response.data;
  },

  // Admin: Get course videos
  getCourseVideos: async (courseId, includeInactive = false) => {
    const response = await videoApi.get(`/mux/courses/${courseId}/videos?includeInactive=${includeInactive}`);
    return response.data;
  },

  // Admin: Update video details
  updateVideo: async (videoId, updates) => {
    const response = await videoApi.put(`/mux/videos/${videoId}`, updates);
    return response.data;
  },

  // Admin: Delete video
  deleteVideo: async (videoId) => {
    const response = await videoApi.delete(`/mux/videos/${videoId}`);
    return response.data;
  },

  // Admin: Reorder videos
  reorderVideos: async (courseId, videoOrders) => {
    const response = await videoApi.put(`/mux/courses/${courseId}/videos/reorder`, { videoOrders });
    return response.data;
  },

  // User: Get course videos (public)
  getUserCourseVideos: async (courseId) => {
    const response = await videoApi.get(`/api/videos/courses/${courseId}`);
    return response.data;
  },

  // User: Get video details
  getVideoDetails: async (videoId) => {
    const response = await videoApi.get(`/api/videos/${videoId}/details`);
    return response.data;
  },

  // User: Get video stream URL
  getVideoStreamUrl: async (videoId, deviceFingerprint) => {
    const response = await videoApi.post(`/api/videos/${videoId}/stream-url`, {
      deviceFingerprint,
      watchTime: 0
    });
    return response.data;
  },

  // User: Update watch progress
  updateWatchProgress: async (videoId, watchTime, completed = false) => {
    const response = await videoApi.put(`/api/videos/${videoId}/progress`, {
      watchTime,
      completed
    });
    return response.data;
  },

  // Get Mux service status
  getMuxStatus: async () => {
    const response = await videoApi.get('/mux/status');
    return response.data;
  },

  // Admin: Get video stream URL for preview
  getAdminVideoStream: async (videoId) => {
    try {
      // Try the old endpoint first (since backend might not be updated)
      const response = await videoApi.get(`/admin/videos/videos/${videoId}/stream`, {
        headers: {
          'accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 202) {
        // Video is still processing
        throw new Error(`Video is still processing: ${error.response.data.status}`);
      }
      
      // If the old endpoint fails, try the new one
      if (error.response?.status === 404) {
        console.log('Old endpoint not found, trying new endpoint format...');
        try {
          const response = await videoApi.get(`/admin/videos/${videoId}/stream`, {
            headers: {
              'accept': 'application/json'
            }
          });
          return response.data;
        } catch (newError) {
          console.log('New endpoint also failed, trying user endpoint as fallback...');
          // Try user endpoint as last resort
          try {
            const response = await videoApi.post(`/api/videos/${videoId}/stream-url`, {
              deviceFingerprint: 'admin-preview',
              watchTime: 0
            });
            return response.data;
          } catch (userError) {
            console.error('All endpoints failed:', {
              oldError: error.message,
              newError: newError.message,
              userError: userError.message
            });
            throw userError;
          }
        }
      }
      
      throw error;
    }
  },

  // Admin: Test video stream connectivity
  testVideoStream: async (streamUrl) => {
    try {
      const response = await fetch(streamUrl, {
        method: 'HEAD',
        headers: {
          'Range': 'bytes=0-1'
        }
      });
      return {
        success: response.ok,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default videoService;
