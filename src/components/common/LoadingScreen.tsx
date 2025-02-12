import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        gap: 2,
        zIndex: (theme) => theme.zIndex.modal + 1,
      }}
    >
      <CircularProgress 
        size={48}
        thickness={4}
        sx={{
          color: 'primary.main',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round'
          }
        }}
      />
      <Box 
        sx={{
          width: 100,
          height: 3,
          borderRadius: 1,
          bgcolor: 'primary.lighter',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'primary.main',
            animation: 'loading 1.5s infinite',
            borderRadius: 1,
          },
          '@keyframes loading': {
            '0%': {
              transform: 'translateX(-100%)',
            },
            '50%': {
              transform: 'translateX(100%)',
            },
            '100%': {
              transform: 'translateX(-100%)',
            },
          },
        }}
      />
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'text.secondary',
          mt: 1
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
