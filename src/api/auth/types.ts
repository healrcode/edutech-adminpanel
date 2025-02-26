export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    status: string;
    avatar?: string;
  };
  accessToken: string;
  refreshToken: string;
  session: {
    id: string;
    expiresAt: string;
    refreshExpiresAt?: string;
  };
  message?: string;
}

export interface FirebaseAuthRequest {
  token: string;
}

export interface OTPRequest {
  email: string;
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ApiError {
  code: string;
  message: string;
}
