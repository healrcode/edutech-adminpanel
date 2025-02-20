import api from './client';
import type { User } from '../store/types';
import type { ApiResponse } from './types';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface OtpVerifyRequest {
  email: string;
  otp: string;
}

interface FirebaseAuthRequest {
  token: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  // Refresh token
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Get current user
  me: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Send OTP to email
  sendOTP: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/email/otp', { email });
    return response.data;
  },

  // Verify OTP and get tokens
  verifyOTP: async (data: OtpVerifyRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/email/verify', data);
    return response.data;
  },

  // Firebase authentication
  firebaseAuth: async (data: FirebaseAuthRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/firebase', data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  }
};
