import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, loading } = useAuth();
  const { clearOtpFlow } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      clearOtpFlow();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header onMenuClick={handleSidebarToggle} />
      
      <Sidebar
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          mt: { xs: 7, sm: 8 },
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ...(sidebarOpen && {
            marginLeft: '100px',
            transition: (theme) =>
              theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
          ...(!sidebarOpen && {
            marginLeft: '72px',
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
