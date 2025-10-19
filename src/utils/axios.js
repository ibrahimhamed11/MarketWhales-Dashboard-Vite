import Axios from "axios";
import { API_URL, DEFAULT_HEADERS } from "../apis/config";

// Use centralized API_URL from config
const axiosInstance = Axios.create({
  baseURL: API_URL,
  headers: DEFAULT_HEADERS,
});

axiosInstance.interceptors.request.use((config) => {
  // Ensure default headers are applied
  config.headers = { ...DEFAULT_HEADERS, ...config.headers };
  config.headers.Accept = "application/json";
  return config;
});

// Export API_URL for backward compatibility
export { API_URL };
export default axiosInstance;
