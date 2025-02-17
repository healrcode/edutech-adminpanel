import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import useAuthStore from './store/authStore';
import LoadingScreen from './pages/auth/LoadingScreen';
import theme from './theme';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Users from './pages/users/Users';
import EnrollmentsAnalytics from './pages/enrollments/EnrollmentsAnalytics';
import Courses from './pages/courses/Courses';

// Route Guards
import PublicRoute from './components/common/PublicRoute';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const store = useAuthStore();

  useEffect(() => {
    // Allow hydration of persisted state
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN', 'SUPERADMIN']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route
              path="/enrollments"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                  <EnrollmentsAnalytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                  <Courses />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route
              path="*"
              element={<Navigate to="/login" replace />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
