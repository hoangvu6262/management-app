import { apiCall, isAuthenticated } from "./api";

// List of endpoints that require authentication
const PROTECTED_ENDPOINTS = [
  '/footballmatch',
  '/calendar',
  '/auth/change-password',
  '/auth/revoke-token',
  '/auth/revoke-all-tokens',
  '/analytics' // Add analytics endpoints
];

// Helper to check if endpoint requires auth
export const isProtectedEndpoint = (url: string): boolean => {
  return PROTECTED_ENDPOINTS.some(endpoint => url.startsWith(endpoint));
};

// Enhanced API call with explicit auth checking
export const protectedApiCall = async <T = any>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  data?: any,
  config?: any
): Promise<T> => {
  // Check auth before making protected API calls
  if (isProtectedEndpoint(url) && !isAuthenticated()) {
    throw new Error('Authentication required for this endpoint');
  }

  return apiCall<T>(method, url, data, config);
};

// Create protectedApi instance with common HTTP methods
export const protectedApi = {
  get: <T = any>(url: string, config?: any) => 
    protectedApiCall<T>("GET", url, undefined, config),
  
  post: <T = any>(url: string, data?: any, config?: any) => 
    protectedApiCall<T>("POST", url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: any) => 
    protectedApiCall<T>("PUT", url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: any) => 
    protectedApiCall<T>("PATCH", url, data, config),
  
  delete: <T = any>(url: string, config?: any) => 
    protectedApiCall<T>("DELETE", url, undefined, config),
};
