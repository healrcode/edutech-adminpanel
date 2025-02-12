import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useAuthStore from '../../store/authStore';
import LoadingScreen from '../../pages/auth/LoadingScreen';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { loading } = useAuth();
  const { isAuthenticated, otpFlow } = useAuthStore();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Preserve OTP flow state during navigation
  if (otpFlow.showOtp && window.location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
