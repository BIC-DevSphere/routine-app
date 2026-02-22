import axios from "axios";
import { API_ENDPOINTS } from "./apiConfig";
import { authClient } from "../auth-client";

export const axiosInstance = axios.create({
  baseURL: API_ENDPOINTS.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const cookies = authClient.getCookie();
      if (cookies) {
        config.headers.Cookie = cookies;
      }
    } catch (error) {
      console.warn("Error retrieving auth cookies:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication error - unauthorized");
    } else if (error.response?.status === 403) {
      console.error("Access forbidden");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
