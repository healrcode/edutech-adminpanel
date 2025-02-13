export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  otpFlow: {
    email: string;
    showOtp: boolean;
  };
  tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  };
}

export interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  setOtpFlowState: (email: string, showOtp: boolean) => void;
  clearOtpFlow: () => void;
  logout: () => void;
}
