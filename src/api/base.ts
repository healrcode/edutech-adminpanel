import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens } from './auth/types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        if (!originalRequest) {
          return Promise.reject(error);
        }

        // If error is not 401 or request already retried, reject
        if (
          error.response?.status !== 401 ||
          (originalRequest as any)._retry
        ) {
          return Promise.reject(this.handleError(error));
        }

        try {
          // Handle token refresh
          if (!this.refreshPromise) {
            this.refreshPromise = this.refreshToken();
          }
          
          const tokens = await this.refreshPromise;
          this.refreshPromise = null;

          // Update tokens
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);

          // Retry original request
          (originalRequest as any)._retry = true;
          originalRequest.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
          return this.client(originalRequest);
        } catch (refreshError) {
          // Clear tokens and reject
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          return Promise.reject(this.handleError(refreshError));
        }
      }
    );
  }

  private async refreshToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.client.post('/auth/refresh-token', {
      refreshToken,
    });

    return response.data.tokens;
  }

  private handleError(error: any) {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data?.error || {
        code: 'unknown',
        message: 'An unknown error occurred',
      };
      return apiError;
    }
    return {
      code: 'unknown',
      message: error.message || 'An unknown error occurred',
    };
  }

  protected async get<T>(url: string) {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  protected async post<T>(url: string, data?: any) {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  protected async put<T>(url: string, data?: any) {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  protected async delete<T>(url: string) {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export const baseClient = new ApiClient();
