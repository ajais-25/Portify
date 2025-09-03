import axios from "axios";

export const API = "/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API,
  withCredentials: true, // Include cookies in requests
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if this request was marked to skip auto-redirect
      const skipRedirect = error.config?.skipAuthRedirect;

      // Token expired or invalid
      // Only redirect if we're not already on the login page and request doesn't skip redirect
      if (!skipRedirect && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
