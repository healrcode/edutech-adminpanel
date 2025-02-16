import React, { createContext, useContext, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { authApi } from '../api/auth';
import { setAuthToken } from '../api/client';
import type { User } from '../store/types';
import type { ApiResponse, ApiError } from '../api/types';

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

  // Only check token validity on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Starting auth initialization');
        store.setLoading(true);
        
        // Get stored tokens
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!accessToken || !refreshToken) {
          console.log('AuthContext: No tokens found, clearing state');
          store.setUser(null);
          store.setTokens(null, null);
          setAuthToken(null);
          return;
        }

        // Set token in API client
        setAuthToken(accessToken);
        
        try {
          // Verify token by making a test request
          const user = await authApi.me();
          store.setUser(user);
          store.setTokens(accessToken, refreshToken);
          console.log('AuthContext: Auth state restored successfully');
        } catch (error) {
          console.error('AuthContext: Token validation failed:', error);
          // Token validation failed, clear auth state
          store.setUser(null);
          store.setTokens(null, null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setAuthToken(null);
        }
      } finally {
        store.setLoading(false);
      }
    };

    initializeAuth();
    // We intentionally only want this to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithFirebase = async (token: string) => {
    store.setLoading(true);
    try {
      const response = await authApi.firebaseAuth({ token });
      
      // Set token in API client first
      setAuthToken(response.accessToken);
      
      // Then update store and localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      store.setTokens(response.accessToken, response.refreshToken);
      store.setUser(response.user);
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
      await authApi.sendOTP(email);
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

      console.log('AuthContext: Starting OTP verification');
      const response = await authApi.verifyOTP({ email, otp });
      
      // Set token in API client first
      setAuthToken(response.accessToken);
      
      // Then update store and localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      store.setTokens(response.accessToken, response.refreshToken);
      store.setUser(response.user);
      
      console.log('AuthContext: Auth successful:', {
        user: response.user.email,
        role: response.user.role
      });
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
      await authApi.logout();
      
      // Clear token from API client
      setAuthToken(null);
      
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
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
