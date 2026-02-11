import axios from "axios";
import { useAuthStore } from "../store/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._isRetry &&
      !originalRequest.url?.includes("/auth/refreshToken")
    ) {
      originalRequest._isRetry = true;

      try {
        console.log("Refreshing token...");
        await api.post(`${import.meta.env.VITE_BACKEND_API_URL}/auth/refreshToken`);
        return api.request(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
