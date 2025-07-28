import axios, { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { tokenManager } from "./tokenManager";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Helper function to check if token is expired or about to expire
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    // Check if token expires in next 30 seconds
    return payload.exp <= currentTime + 30;
  } catch {
    return true;
  }
};

// Helper function to check if user is authenticated
const isAuthenticated = (): boolean => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  // User is authenticated if they have either a valid access token OR a refresh token
  return (accessToken && !isTokenExpired(accessToken)) || !!refreshToken;
};

// Helper function to handle logout silently
const handleLogoutSilently = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("user");

  // Reset token manager
  tokenManager.reset();

  // Dispatch Redux logout if available
  if (typeof window !== "undefined" && (window as any).dispatchLogout) {
    (window as any).dispatchLogout();
  }
};

// Request interceptor to add auth token and handle proactive refresh
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = Cookies.get("accessToken");

    // If no token exists, check if we have refresh token for auth-required endpoints
    if (!token) {
      const refreshToken = Cookies.get("refreshToken");

      // If no refresh token either, let the request go through
      // (might be a public endpoint or will get 401)
      if (!refreshToken) {
        return config;
      }

      // If we have refresh token but no access token, try to refresh
      if (tokenManager.canRefresh()) {
        try {
          token = await tokenManager.refreshToken();
        } catch (error) {
          handleLogoutSilently();
          return config; // Let request fail with 401
        }
      }
    }

    // If we have a token, check if it's expired/expiring
    if (token && isTokenExpired(token) && tokenManager.canRefresh()) {
      try {
        token = await tokenManager.refreshToken();
      } catch (error) {
        handleLogoutSilently();
        throw error;
      }
    }

    // Add token to request if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors as fallback
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      tokenManager.canRefresh()
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await tokenManager.refreshToken();

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Clear tokens but don't redirect here - let the app handle it
        handleLogoutSilently();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
  timestamp: string;
}

// Generic API call function
export const apiCall = async <T = any>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  data?: any,
  config?: any
): Promise<T> => {
  try {
    let response: AxiosResponse<ApiResponse<T>>;

    switch (method) {
      case "GET":
        response = await axiosInstance.get(url, config);
        break;
      case "POST":
        response = await axiosInstance.post(url, data, config);
        break;
      case "PUT":
        response = await axiosInstance.put(url, data, config);
        break;
      case "PATCH":
        response = await axiosInstance.patch(url, data, config);
        break;
      case "DELETE":
        response = await axiosInstance.delete(url, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "API call failed");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error(`[API] ${method} ${url} failed:`, {
        status: error.response?.status,
        message,
        hasAuth: !!Cookies.get("accessToken"),
      });
      throw new Error(message);
    }
    throw error;
  }
};

// Export helper functions for manual use
export { isTokenExpired, isAuthenticated };
