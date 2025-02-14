import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Stack,
  Container,
  Tooltip
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, loading } = useAuth();
  const { clearOtpFlow } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      clearOtpFlow(); // Clear OTP state on logout
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getDisplayName = (user: { firstName?: string; lastName?: string; email: string }) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
  };

  if (loading) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: 'primary.main',
              fontWeight: 600
            }}
          >
            EduTech Admin
          </Typography>
          
          {user && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Tooltip title={user.email}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main',
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem'
                  }}
                >
                  {getInitials(getDisplayName(user))}
                </Avatar>
              </Tooltip>
              <Button 
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Logout
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          pt: { xs: 7, sm: 8 },
          pb: 3
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
