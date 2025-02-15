import { ApiClient } from '../base';
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
    const response = await this.post<AuthResponse>('/auth/firebase', data);
    
    // Store tokens
    if (response.tokens) {
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
    }

    return response;
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
    const response = await this.post<AuthResponse>('/auth/email/verify', data);
    
    // Store tokens
    if (response.tokens) {
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
    }

    return response;
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/refresh', data);
    
    // Store new tokens
    if (response.tokens) {
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
    }

    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout');
    } finally {
      // Clear tokens regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
}

export const authClient = new AuthClient();
