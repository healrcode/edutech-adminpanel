import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#1B4965',
      light: '#2C6284',
      lighter: '#E6F4F9',
      dark: '#133449'
    },
    secondary: {
      main: '#5FA777',
      light: '#7AB890',
      lighter: '#EDF7EF',
      dark: '#4A8A5E'
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B'
    },
    divider: '#E2E8F0',
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#FFFFFF'
    }
  },
  typography: {
    fontFamily: '"Outfit", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem'
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem'
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem'
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
          '&.Mui-disabled': {
            backgroundColor: '#E2E8F0',
            color: '#94A3B8'
          }
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#133449'
          }
        },
        outlined: {
          borderColor: '#E2E8F0',
          '&:hover': {
            backgroundColor: '#F8FAFC',
            borderColor: '#1B4965'
          }
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E2E8F0'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1B4965',
              borderWidth: 2
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1B4965'
            }
          }
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E2E8F0'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8
        },
        standardSuccess: {
          backgroundColor: '#EDF7EF',
          color: '#4A8A5E'
        },
        standardError: {
          backgroundColor: '#FEF2F2',
          color: '#DC2626'
        }
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          strokeLinecap: 'round'
        }
      }
    }
  },
  shape: {
    borderRadius: 8
  }
};

const theme = createTheme(themeOptions);

export default theme;
