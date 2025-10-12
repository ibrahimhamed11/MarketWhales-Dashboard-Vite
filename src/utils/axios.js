import Axios from "axios";


export const API_URL = "https://market-whales.onrender.com";
// export const API_URL = "http://127.0.0.1:4000";

const axiosInstance = Axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.Accept = "application/json";
  return config;
});

export default axiosInstance;
