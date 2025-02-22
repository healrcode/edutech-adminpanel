import { ApiClient } from '../base';
import { setAuthToken } from '../client';
import {
  AuthResponse,
  FirebaseAuthRequest,
  OTPRequest,
  OTPVerifyRequest,
  RefreshTokenRequest,
} from './types';

class AuthClient extends ApiClient {
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<AuthResponse['user']> {
    return this.get<AuthResponse['user']>('/auth/me');
  }

  /**
   * Authenticate with Firebase
   */
  async firebaseAuth(data: FirebaseAuthRequest): Promise<AuthResponse> {
    const authResponse = await this.post<AuthResponse>('/auth/firebase', data);
    
    // Store tokens and set auth header
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    setAuthToken(authResponse.accessToken);

    return authResponse;
  }

  /**
   * Send OTP to email
   */
  async sendOTP(data: OTPRequest): Promise<{ message: string }> {
    return this.post<{ message: string }>('/auth/email/otp', data);
  }

  /**
   * Verify OTP and sign in
   */
  async verifyOTP(data: OTPVerifyRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/email/verify', data);
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/refresh', data);
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout');
    } finally {
      // Clear tokens and auth header regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAuthToken(null);
    }
  }
}

export const authClient = new AuthClient();
