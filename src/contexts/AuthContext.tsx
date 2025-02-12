import React, { createContext, useContext, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import type { User } from '../store/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithOtp: (emailOrPhone: string) => Promise<boolean>;
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('AuthContext: Initial auth check');
        await new Promise(resolve => setTimeout(resolve, 500));
        store.setUser(null);
      } finally {
        store.setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginWithGoogle = async () => {
    store.setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        name: 'Test User'
      };
      store.setUser(mockUser);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  };

  const loginWithOtp = async (emailOrPhone: string) => {
    console.log('AuthContext: Starting loginWithOtp for:', emailOrPhone);
    try {
      console.log('AuthContext: Simulating API delay...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('AuthContext: OTP sent successfully');
      store.setOtpFlowState(emailOrPhone, true);
      return true;
    } catch (error) {
      console.log('AuthContext: Error in loginWithOtp:', error);
      console.error('OTP send error:', error);
      store.clearOtpFlow();
      throw error;
    }
  };

  const verifyOtp = async (otp: string) => {
    console.log('AuthContext: Starting verifyOtp with otp:', otp);
    store.setLoading(true);
    try {
      console.log('AuthContext: Simulating verification delay...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (otp === '123456') {
        console.log('AuthContext: OTP verified successfully');
        const mockUser = {
          id: '1',
          email: store.otpFlow.email,
          name: 'Test User'
        };
        store.setUser(mockUser);
      } else {
        console.log('AuthContext: Invalid OTP provided');
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      console.log('AuthContext: Error in verifyOtp:', error);
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      console.log('AuthContext: Setting loading to false');
      store.setLoading(false);
    }
  };

  const logout = async () => {
    store.setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      store.logout();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: store.user,
        loading: store.loading,
        isAuthenticated: store.isAuthenticated,
        loginWithGoogle,
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
