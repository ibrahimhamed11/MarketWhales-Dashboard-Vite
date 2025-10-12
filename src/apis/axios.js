import Axios from "axios";

// Use production API URL by default, fallback to environment variable or local
export const API_URL = import.meta.env.VITE_API_URL || "https://market-whales.onrender.com";

const axiosInstance = Axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.Accept = "application/json";
  return config;
});

export default axiosInstance;
