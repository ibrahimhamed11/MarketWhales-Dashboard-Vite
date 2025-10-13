/**
 * Centralized API Configuration
 * This file contains all API-related configurations and constants
 */

// Base API URL configuration
export const API_URL = import.meta.env.VITE_API_URL || "https://market-whales.onrender.com";

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

  // User video endpoints (currently using admin endpoints)
  USER_VIDEOS: {
    COURSE_VIDEOS: (courseId) => `/admin/videos/courses/${courseId}`, // Using admin endpoint for now
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
  MUX_ENV_KEY,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  VIDEO_HEADERS,
  TOKEN_STORAGE_KEY,
  getAuthToken,
  getAuthHeaders,
  getVideoAuthHeaders,
  REQUEST_CONFIG,
};
