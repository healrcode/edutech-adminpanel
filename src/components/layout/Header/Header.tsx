import React from 'react';
import {
  AppBar,
  Stack,
  Toolbar,
  IconButton,
  Avatar,
  Tooltip,
  Button,
  useTheme,
  useMediaQuery,
  Box
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import useAuthStore from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const { clearOtpFlow } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      clearOtpFlow();
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

  return (
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
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }} />

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
                  bgcolor: 'action.hover'
                }
              }}
            >
              Logout
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
