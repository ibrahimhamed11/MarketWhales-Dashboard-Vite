/**
 * Centralized API Configuration
 * This file contains all API-related configurations and constants
 */

// Environment detection
const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

// Backend URL configurations
const BACKEND_URLS = {
  development: 'http://localhost:4000', // Local backend
  production: 'https://market-whales.onrender.com', // Production backend
};

// Get API URL based on environment or manual override
export const getApiUrl = () => {
  // Check for manual override first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Use environment-based URL
  if (isDevelopment) {
    return BACKEND_URLS.development;
  }
  
  return BACKEND_URLS.production;
};

// Base API URL configuration
export const API_URL = getApiUrl();

// Environment info for debugging
export const ENV_INFO = {
  mode: import.meta.env.MODE,
  isDevelopment,
  isProduction,
  apiUrl: API_URL,
  manualOverride: !!import.meta.env.VITE_API_URL,
};

// MUX configuration
export const MUX_ENV_KEY = import.meta.env.VITE_MUX_ENV_KEY;

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },

  // Course endpoints
  COURSES: {
    BASE: '/courses',
    BY_ID: (id) => `/courses/${id}`,
    DELETE: (id) => `/courses/${id}`,
  },

  // Admin video endpoints (only used endpoints)
  ADMIN_VIDEOS: {
    // Video Upload Endpoints
    UPLOAD: (courseId) => `/admin/videos/courses/${courseId}/upload`,
    UPLOAD_BY_URL: (courseId) => `/admin/videos/courses/${courseId}/upload-by-url`,
    
    // Course Video Management  
    COURSE_VIDEOS: (courseId) => `/admin/videos/courses/${courseId}`,
    
    // Video Details & Management
    VIDEO_BY_ID: (videoId) => `/admin/videos/${videoId}`,
    VIDEO_STREAM: (videoId) => `/admin/videos/${videoId}/stream`,
    
    // Video Operations
    REORDER_VIDEOS: (courseId) => `/admin/videos/courses/${courseId}/reorder`,
    VIDEO_STATUS: (videoId) => `/admin/videos/${videoId}/status`,
    
    // System & Status (moved to avoid route conflicts)
    MUX_STATUS: '/admin/videos/system/mux-status',
  },

  // User video endpoints (matching backend routes EXACTLY)
  USER_VIDEOS: {
    COURSES: '/courses', // Get all available courses for user
    COURSE_VIDEOS: (courseId) => `/user/courses/${courseId}/videos`, // Matches backend: router.get("/courses/:courseId/videos")
    VIDEO_STREAM: (videoId) => `/user/videos/${videoId}/stream`, // Matches backend: router.post("/videos/:videoId/stream")
    VIDEO_STREAM_URL: (videoId) => `/user/videos/${videoId}/stream-url`, // Matches backend: router.post("/videos/:videoId/stream-url")
    VIDEO_DETAILS: (videoId) => `/user/videos/${videoId}/details`, // Matches backend: router.get("/videos/:videoId/details")
    VIDEO_PROGRESS: (videoId) => `/user/videos/${videoId}/progress`, // Matches backend: router.put/post("/videos/:videoId/progress")
    COURSE_PROGRESS: (courseId) => `/user/courses/${courseId}/progress`, // Matches backend: router.get("/courses/:courseId/progress")
    VIDEO_MANIFEST: (videoId) => `/user/videos/${videoId}/manifest`, // Matches backend: router.get("/videos/:videoId/manifest")
    REFRESH_TOKEN: '/user/videos/refresh-token', // Matches backend: router.post("/videos/refresh-token")
    VALIDATE_TOKEN: '/user/videos/validate-token', // Matches backend: router.post("/videos/validate-token")
    VIDEO_PLAYLIST: (courseId) => `/user/courses/${courseId}/videos/playlist`, // Matches backend: router.get("/courses/:courseId/videos/playlist")
  },
};

// HTTP headers configuration
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Client-Type': 'web-dashboard',
};

export const VIDEO_HEADERS = {
  ...DEFAULT_HEADERS,
  'X-Video-Provider': 'mux',
};

// Token storage key
export const TOKEN_STORAGE_KEY = 'token';

// Utility function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

// Utility function to get auth headers
export const getAuthHeaders = (additionalHeaders = {}) => {
  const token = getAuthToken();
  const headers = { ...DEFAULT_HEADERS, ...additionalHeaders };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No authentication token found in localStorage');
  }
  
  return headers;
};

// Utility function to get video auth headers
export const getVideoAuthHeaders = (additionalHeaders = {}) => {
  const baseHeaders = getAuthHeaders({ ...VIDEO_HEADERS, ...additionalHeaders });
  
  // Add MUX environment key if available
  if (MUX_ENV_KEY) {
    baseHeaders['X-Mux-Env-Key'] = MUX_ENV_KEY;
  }
  
  return baseHeaders;
};

// Request configuration templates
export const REQUEST_CONFIG = {
  // Standard JSON request
  json: (additionalHeaders = {}) => ({
    headers: getAuthHeaders(additionalHeaders),
  }),

  // Form data request
  formData: (additionalHeaders = {}) => ({
    headers: getAuthHeaders({
      'Content-Type': 'multipart/form-data',
      ...additionalHeaders,
    }),
  }),

  // Video request
  video: (additionalHeaders = {}) => ({
    headers: getVideoAuthHeaders(additionalHeaders),
  }),

  // Upload with progress tracking
  upload: (onProgress, additionalHeaders = {}) => ({
    headers: getAuthHeaders({
      'Content-Type': 'multipart/form-data',
      ...additionalHeaders,
    }),
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.lengthComputable) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  }),
};

export default {
  API_URL,
  ENV_INFO,
  MUX_ENV_KEY,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  VIDEO_HEADERS,
  TOKEN_STORAGE_KEY,
  getAuthToken,
  getAuthHeaders,
  getVideoAuthHeaders,
  REQUEST_CONFIG,
  getApiUrl,
};
