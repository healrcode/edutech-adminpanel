import axios from 'axios';
import type { ApiResponse } from '../api/types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Standalone function to refresh token without using the main API client
export const refreshToken = async (refreshToken: string): Promise<TokenResponse> => {
  try {
    const response = await axios.post<ApiResponse<TokenResponse>>(`${BASE_URL}/auth/refresh`, {
      refreshToken
    });
    
    if (!response.data.data.accessToken || !response.data.data.refreshToken) {
      throw new Error('Invalid token response');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('[Auth Service] Token refresh failed:', error);
    throw new Error('Failed to refresh authentication token');
  }
};
