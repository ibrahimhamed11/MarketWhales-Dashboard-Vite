import Axios from "axios";
import { API_URL, DEFAULT_HEADERS, ENV_INFO } from "./config";

// Create axios instance with centralized configuration
const axiosInstance = Axios.create({
  baseURL: API_URL,
  headers: DEFAULT_HEADERS,
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  // Ensure default headers are applied
  config.headers = { ...DEFAULT_HEADERS, ...config.headers };
  
  // Add environment info to headers for debugging
  if (ENV_INFO.isDevelopment) {
    config.headers['X-Client-Env'] = ENV_INFO.mode;
    config.headers['X-Client-Version'] = '1.0.1';
  }
  
  // Log request in development
  if (ENV_INFO.isDevelopment || import.meta.env.VITE_DEBUG_API === 'true') {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data,
    });
  }
  
  return config;
}, (error) => {
  console.error('❌ Request interceptor error:', error);
  return Promise.reject(error);
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (ENV_INFO.isDevelopment || import.meta.env.VITE_DEBUG_API === 'true') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Enhanced error handling with environment-specific messages
    let userMessage = 'An error occurred. Please try again.';
    
    if (error.code === 'ENOTFOUND' || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
      console.error('🌐 DNS Resolution Error:', error);
      userMessage = `Unable to connect to the server at ${API_URL}. Please check your internet connection and server status.`;
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      console.error('⏰ Request Timeout:', error);
      userMessage = 'Request timed out. Please check your internet connection and try again.';
    } else if (error.response?.status >= 500) {
      console.error('🚨 Server Error:', error);
      userMessage = 'Server error. Please try again later.';
    } else if (error.response?.status === 404) {
      console.error('🔍 Not Found:', error);
      userMessage = 'The requested resource was not found.';
    } else if (error.response?.status === 401) {
      console.error('🔒 Unauthorized:', error);
      userMessage = 'Authentication required. Please log in again.';
    } else if (error.response?.status === 403) {
      console.error('🚫 Forbidden:', error);
      userMessage = 'You do not have permission to access this resource.';
    }
    
    // Log error details in development
    if (ENV_INFO.isDevelopment || import.meta.env.VITE_DEBUG_API === 'true') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code,
      });
    }
    
    // Attach user-friendly message
    error.userMessage = userMessage;
    
    return Promise.reject(error);
  }
);

// Export the API_URL for backward compatibility
export { API_URL };
export default axiosInstance;
