import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import api from './client';
import { AuthTokens } from './auth/types';
import { ApiResponse } from './types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor() {
    this.client = api;
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

  private isApiResponse<T>(data: any): data is ApiResponse<T> {
    return data && typeof data === 'object' && 'success' in data && 'data' in data;
  }

  protected async get<T>(url: string, config?: any): Promise<T> {
    console.log('[API] GET request to:', BASE_URL + url);
    const response = await this.client.get<T | ApiResponse<T>>(url, config);
    return this.isApiResponse<T>(response.data) ? response.data.data : response.data;
  }

  protected async post<T>(url: string, data?: any, config?: any): Promise<T> {
    console.log('[API] POST request to:', BASE_URL + url, 'with data:', data);
    const response = await this.client.post<T | ApiResponse<T>>(url, data, config);
    return this.isApiResponse<T>(response.data) ? response.data.data : response.data;
  }

  protected async put<T>(url: string, data?: any, config?: any): Promise<T> {
    console.log('[API] PUT request to:', BASE_URL + url, 'with data:', data);
    const response = await this.client.put<T | ApiResponse<T>>(url, data, config);
    return this.isApiResponse<T>(response.data) ? response.data.data : response.data;
  }

  protected async delete<T>(url: string, config?: any): Promise<T> {
    console.log('[API] DELETE request to:', BASE_URL + url);
    const response = await this.client.delete<T | ApiResponse<T>>(url, config);
    return this.isApiResponse<T>(response.data) ? response.data.data : response.data;
  }
}

export const baseClient = new ApiClient();
