import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);  // Start with loading true
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
      console.log('AuthContext: Initial auth check');
      await new Promise(resolve => setTimeout(resolve, 500));  // Reduced timeout
      setUser(null);
      } finally {
        setLoading(false);  // Set loading to false after initial check
        setInitialLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        name: 'Test User'
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithOtp = async (emailOrPhone: string) => {
    console.log('AuthContext: Starting loginWithOtp for:', emailOrPhone);
    try {
      // Don't set loading during OTP send to prevent re-renders
      console.log('AuthContext: Simulating API delay...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('AuthContext: OTP sent successfully');
      return true;
    } catch (error) {
      console.log('AuthContext: Error in loginWithOtp:', error);
      console.error('OTP send error:', error);
      throw error;
    }
  };

  const verifyOtp = async (otp: string) => {
    console.log('AuthContext: Starting verifyOtp with otp:', otp);
    setLoading(true);
    try {
      console.log('AuthContext: Simulating verification delay...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (otp === '123456') {
        console.log('AuthContext: OTP verified successfully');
        const mockUser = {
          id: '1',
          email: 'user@example.com',
          name: 'Test User'
        };
        setUser(mockUser);
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
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
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
