import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  // Optional flag to redirect authenticated users away from this route (e.g., login page)
  redirectAuthenticated?: boolean;
  // Optional path to redirect to (defaults to /dashboard)
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectAuthenticated = false,
  redirectTo = '/dashboard'
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You might want to show a loading spinner here
    return <div>Loading...</div>;
  }

  // Get the redirect path from location state or use default
  const from = (location.state as any)?.from?.pathname || redirectTo;

  if (redirectAuthenticated && isAuthenticated) {
    // Redirect authenticated users to the page they came from or dashboard
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
