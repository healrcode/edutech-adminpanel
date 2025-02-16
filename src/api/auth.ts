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
    return api.post('/auth/refresh', { refreshToken });
  },

  // Get current user
  me: async (): Promise<User> => {
    return api.get('/auth/me');
  },

  // Send OTP to email
  sendOTP: async (email: string): Promise<void> => {
    await api.post('/auth/email/otp', { email });
  },

  // Verify OTP and get tokens
  verifyOTP: async (data: OtpVerifyRequest): Promise<AuthResponse> => {
    return api.post('/auth/email/verify', data);
  },

  // Firebase authentication
  firebaseAuth: async (data: FirebaseAuthRequest): Promise<AuthResponse> => {
    return api.post('/auth/firebase', data);
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  }
};
