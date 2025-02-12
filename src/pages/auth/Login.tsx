import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
  Alert,
  useTheme
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { loginWithGoogle, loginWithOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to login with Google');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      setError(null);
      setLoading(true);
      await loginWithOtp(emailOrPhone);
      setIsOtpSent(true);
    } catch (err) {
      setError('Failed to send OTP');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setError(null);
      setLoading(true);
      await verifyOtp(otp);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid OTP');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Container maxWidth="xs">
        <Card 
          sx={{ 
            p: 4,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          }}
        >
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600
                }}
              >
                Welcome Back
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
              >
                Login to access your account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Google Login */}
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              size="large"
              disabled={loading}
            >
              Continue with Google
            </Button>

            <Divider sx={{ color: 'text.secondary' }}>OR</Divider>

            {/* Email/Phone + OTP Section */}
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Email or Phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                disabled={isOtpSent || loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />

              {isOtpSent ? (
                <>
                  <TextField
                    fullWidth
                    label="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleVerifyOtp}
                    size="large"
                    disabled={loading || !otp}
                  >
                    Verify OTP
                  </Button>
                </>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSendOtp}
                  size="large"
                  disabled={loading || !emailOrPhone}
                >
                  Send OTP
                </Button>
              )}
            </Stack>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
