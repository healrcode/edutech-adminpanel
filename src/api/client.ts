import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse, ApiError } from './types';
import useAuthStore from '../store/authStore';

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
  <T>(response: AxiosResponse<ApiResponse<T>>) => {
    // Always return the data property from the response
    return response.data.data;
  },
  async (error: AxiosError<ApiResponse<any>>) => {
    const originalRequest = error.config;
    
    // Handle 401 errors
    if (error.response?.status === 401 && originalRequest) {
      try {
        // Get refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Try to refresh token
        const response = await axios.post<ApiResponse<{ accessToken: string, refreshToken: string }>>(`${BASE_URL}/auth/refresh`, {
          refreshToken
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

        // Update tokens
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        setAuthToken(newAccessToken);

        // Update auth store
        const store = useAuthStore.getState();
        store.setTokens(newAccessToken, newRefreshToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
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
