import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse, ApiError } from './types';
import useAuthStore from '../store/authStore';
import { refreshToken } from '../services/auth';

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
// Store pending requests to retry after token refresh
let pendingRequests: ((token: string) => void)[] = [];

// Helper to retry failed requests
const retryRequest = (failedRequest: any, token: string) => {
  failedRequest.headers.Authorization = `Bearer ${token}`;
  return axios(failedRequest);
};

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('[API] Making request to:', `${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  <T>(response: AxiosResponse<ApiResponse<T> | T>) => {
    // Handle both wrapped and unwrapped responses
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      const apiResponse = response.data as ApiResponse<T>;
      if (!apiResponse.success) {
        throw new Error(apiResponse.error?.message || 'API request failed');
      }
      return apiResponse.data;
    }
    return response.data as T;
  },
  async (error: AxiosError<ApiResponse<any>>) => {
    const originalRequest = error.config;
    
    // Handle 401 errors
    if (error.response?.status === 401 && originalRequest) {
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // Get refresh token
          const currentRefreshToken = localStorage.getItem('refreshToken');
          
          if (!currentRefreshToken) {
            throw new Error('No refresh token available');
          }

          // Try to refresh token
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshToken(currentRefreshToken);

          // Update tokens
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          setAuthToken(newAccessToken);

          // Update auth store
          const store = useAuthStore.getState();
          store.setTokens(newAccessToken, newRefreshToken);

          // Retry all pending requests
          pendingRequests.forEach(cb => cb(newAccessToken));
          pendingRequests = [];

          // Retry the original request
          return retryRequest(originalRequest, newAccessToken);
        } catch (refreshError) {
          // Clear auth state on refresh failure
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          const store = useAuthStore.getState();
          store.logout();
          
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }

          // Reject all pending requests
          pendingRequests.forEach(cb => cb(''));
          pendingRequests = [];
        } finally {
          isRefreshing = false;
        }
      } else {
        // Queue the request to be retried
        return new Promise(resolve => {
          pendingRequests.push((token: string) => {
            if (token) {
              resolve(retryRequest(originalRequest, token));
            } else {
              resolve(Promise.reject(error));
            }
          });
        });
      }
    }

    // Format error response
    const apiError: ApiError = {
      code: error.response?.status === 401 ? 'unauthorized' : 'unknown',
      message: error.response?.data?.error?.message || error.message || 'An unknown error occurred',
      details: error.response?.data?.error?.details
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error:', apiError);
    }

    return Promise.reject(apiError);
  }
);

// Helper to set auth token (used after login/token refresh)
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
