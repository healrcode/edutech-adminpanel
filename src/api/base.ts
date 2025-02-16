import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens } from './auth/types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor() {
    console.log('[API] Initializing with base URL:', BASE_URL);
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public setAuthToken(token: string | null) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  private setupInterceptors() {
    // Request Interceptor
    // Define public auth endpoints that don't need token
    const publicAuthEndpoints = [
      '/auth/email/otp',
      '/auth/email/verify',
      '/auth/firebase'
    ];

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Log the full URL being requested
        const baseUrl = config.baseURL || '';
        const url = config.url || '';
        console.log('[API] Making request to:', `${baseUrl}${url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Just return the error without attempting refresh
        return Promise.reject(this.handleError(error));
      }
    );
  }


  private handleError(error: any) {
    if (axios.isAxiosError(error)) {
      console.error('[API] Error response:', error.response?.data);
      
      // Handle wrapped error response
      if (error.response?.data?.success === false) {
        const apiError = error.response.data.error;
        if (apiError) {
          return {
            code: apiError.code || 'unknown',
            message: apiError.message || 'An unknown error occurred',
            details: apiError.details
          };
        }
      }

      // Fallback error
      return {
        code: error.response?.status === 401 ? 'unauthorized' : 'unknown',
        message: error.response?.data?.message || error.message || 'An unknown error occurred'
      };
    }
    return {
      code: 'unknown',
      message: error.message || 'An unknown error occurred',
    };
  }

  protected async get<T>(url: string) {
    console.log('[API] GET request to:', BASE_URL + url);
    const response = await this.client.get<{ success: boolean; data: T }>(url);
    console.log('[API] Response data:', response.data);
    return response.data.data;
  }

  protected async post<T>(url: string, data?: any) {
    console.log('[API] POST request to:', BASE_URL + url, 'with data:', data);
    const response = await this.client.post<{ success: boolean; data: T }>(url, data);
    console.log('[API] Response data:', response.data);
    return response.data.data;
  }

  protected async put<T>(url: string, data?: any) {
    console.log('[API] PUT request to:', BASE_URL + url, 'with data:', data);
    const response = await this.client.put<{ success: boolean; data: T }>(url, data);
    console.log('[API] Response data:', response.data);
    return response.data.data;
  }

  protected async delete<T>(url: string) {
    console.log('[API] DELETE request to:', BASE_URL + url);
    const response = await this.client.delete<{ success: boolean; data: T }>(url);
    console.log('[API] Response data:', response.data);
    return response.data.data;
  }
}

export const baseClient = new ApiClient();
