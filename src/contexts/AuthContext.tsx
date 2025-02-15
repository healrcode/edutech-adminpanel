import React, { createContext, useContext, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { authClient } from '../api/auth/client';
import type { User } from '../store/types';
import type { ApiError } from '../api/auth/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  loginWithFirebase: (token: string) => Promise<void>;
  loginWithOtp: (email: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useAuthStore();

  // Check auth status on mount and token changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('AuthContext: Initial auth check');
        store.setLoading(true);
        const user = await authClient.getCurrentUser();
        store.setUser(user);
      } catch (error) {
        console.error('Auth check error:', error);
        store.setUser(null);
      } finally {
        store.setLoading(false);
      }
    };

    // Only check if we have a token
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      checkAuth();
    } else {
      store.setLoading(false);
    }
  }, []);

  const loginWithFirebase = async (token: string) => {
    store.setLoading(true);
    try {
      const response = await authClient.firebaseAuth({ token });
      store.setUser(response.user);
      store.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    } catch (error) {
      console.error('Firebase login error:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to login with Firebase');
    } finally {
      store.setLoading(false);
    }
  };

  const loginWithOtp = async (email: string) => {
    console.log('AuthContext: Starting loginWithOtp for:', email);
    try {
      await authClient.sendOTP({ email });
      store.setOtpFlowState(email, true);
      return true;
    } catch (error) {
      console.error('OTP send error:', error);
      store.clearOtpFlow();
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to send OTP');
    }
  };

  const verifyOtp = async (otp: string) => {
    store.setLoading(true);
    try {
      const email = store.otpFlow.email;
      if (!email) {
        throw new Error('No email found for OTP verification');
      }

      const response = await authClient.verifyOTP({ email, otp });
      store.setUser(response.user);
      store.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    } catch (error) {
      console.error('OTP verification error:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to verify OTP');
    } finally {
      store.setLoading(false);
    }
  };

  const logout = async () => {
    store.setLoading(true);
    try {
      await authClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      store.logout();
      store.setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: store.user,
        loading: store.loading,
        isAuthenticated: store.isAuthenticated,
        loginWithFirebase,
        loginWithOtp,
        verifyOtp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
