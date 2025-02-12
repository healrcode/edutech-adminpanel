export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  otpFlow: {
    email: string;
    showOtp: boolean;
  };
}

export interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setOtpFlowState: (email: string, showOtp: boolean) => void;
  clearOtpFlow: () => void;
  logout: () => void;
}
