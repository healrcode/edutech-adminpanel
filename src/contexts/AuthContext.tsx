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
  loginWithOtp: (emailOrPhone: string) => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Check if user is already logged in
    setLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    try {
      // TODO: Implement Google login
      console.log('Google login');
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const loginWithOtp = async (emailOrPhone: string) => {
    try {
      // TODO: Implement OTP login
      console.log('Send OTP to:', emailOrPhone);
    } catch (error) {
      console.error('OTP send error:', error);
      throw error;
    }
  };

  const verifyOtp = async (otp: string) => {
    try {
      // TODO: Implement OTP verification
      console.log('Verify OTP:', otp);
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // TODO: Implement logout
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    loginWithGoogle,
    loginWithOtp,
    verifyOtp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
