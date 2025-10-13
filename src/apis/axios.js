import Axios from "axios";
import { API_URL, DEFAULT_HEADERS } from "./config";

const axiosInstance = Axios.create({
  baseURL: API_URL,
  headers: DEFAULT_HEADERS,
});

axiosInstance.interceptors.request.use((config) => {
  // Ensure default headers are applied
  config.headers = { ...DEFAULT_HEADERS, ...config.headers };
  
  // Add request timeout to prevent hanging on DNS issues
  config.timeout = config.timeout || 30000; // 30 seconds timeout
  
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor to handle network errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ENOTFOUND' || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
      console.error('DNS Resolution Error:', error);
      error.message = 'Unable to connect to the server. Please check your internet connection and try again.';
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      console.error('Request Timeout:', error);
      error.message = 'Request timed out. Please check your internet connection and try again.';
    } else if (error.response?.status >= 500) {
      console.error('Server Error:', error);
      error.message = 'Server error. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);

// Export the API_URL for backward compatibility
export { API_URL };
export default axiosInstance;
