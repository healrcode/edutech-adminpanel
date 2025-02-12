import React, { useState, useEffect, useCallback } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showResendButton, setShowResendButton] = useState(false);

  const { loginWithGoogle, loginWithOtp, verifyOtp, loading } = useAuth();

  // Show resend button after 30 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOtpInput) {
      timer = setTimeout(() => {
        setShowResendButton(true);
      }, 30000);
    } else {
      setShowResendButton(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showOtpInput]);
  const navigate = useNavigate();

  // Preserve showOtpInput state across re-renders
  useEffect(() => {
    const savedShowOtpInput = localStorage.getItem('showOtpInput');
    console.log('Login: Initial load - saved showOtpInput:', savedShowOtpInput);
    if (savedShowOtpInput === 'true') {
      setShowOtpInput(true);
    }
  }, []);

  // Store showOtpInput state changes
  useEffect(() => {
    console.log('Login: showOtpInput state changed to:', showOtpInput);
    localStorage.setItem('showOtpInput', showOtpInput.toString());
  }, [showOtpInput]);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to login with Google. Please try again.');
      console.error(err);
    }
  };

  const handleSendOtp = useCallback(async () => {
    if (!emailOrPhone) return;

    try {
      console.log('Login: Sending OTP for:', emailOrPhone);
      setError(null);
      const success = await loginWithOtp(emailOrPhone);
      console.log('Login: OTP send result:', success);
      
      if (success) {
        console.log('Login: Setting showOtpInput to true');
        setShowOtpInput(true);
        localStorage.setItem('showOtpInput', 'true');
        setError('OTP sent successfully! For testing, use: 123456');
      }
    } catch (err) {
      console.log('Login: Error sending OTP:', err);
      setError('Failed to send OTP. Please try again.');
      setShowOtpInput(false);
      console.error(err);
    }
  }, [emailOrPhone, loginWithOtp]);

  // Handle cleanup carefully during OTP flow
  useEffect(() => {
    const otpInProgress = loading || showOtpInput;
    return () => {
      if (!otpInProgress) {
        console.log('Login: Safe to clean up - no OTP in progress');
        localStorage.removeItem('showOtpInput');
      } else {
        console.log('Login: Skipping cleanup - OTP in progress');
      }
    };
  }, [loading, showOtpInput]);

  const handleVerifyOtp = async () => {
    if (!otp) return;

    try {
      setError(null);
      await verifyOtp(otp);
      // Let the cleanup run after navigation
      navigate('/dashboard');
    } catch (err) {
      // Just clear the OTP field on error, keep the OTP input visible
      setOtp('');
      setError('Invalid OTP. Please try again. (Hint: Use 123456)');
      console.error(err);
      // Force ensure OTP input stays visible
      setShowOtpInput(true);
      localStorage.setItem('showOtpInput', 'true');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Container maxWidth="xs">
        <Card sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography variant="h4" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please sign in to continue
              </Typography>
            </Box>

            {error && (
              <Alert severity={error.includes('success') ? 'success' : 'error'}>
                {error}
              </Alert>
            )}

            <Button
              variant="outlined"
              fullWidth
              startIcon={!loading && <GoogleIcon />}
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Continue with Google'}
            </Button>

            <Divider>OR</Divider>

            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Email or Phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                disabled={showOtpInput || loading}
              />

              {showOtpInput ? (
                <>
              <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => {
                  // Only allow numbers and limit to 6 digits
                  const newValue = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(newValue);
                }}
                disabled={loading}
                placeholder="Enter the 6-digit OTP code"
                autoFocus
                helperText={`Enter the 6-digit OTP sent to ${emailOrPhone}`}
                inputProps={{
                  maxLength: 6,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleVerifyOtp}
                    disabled={loading || !otp}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
                  </Button>
                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth
                      onClick={() => {
                        console.log('Login: Going back to email/phone input');
                        setOtp('');
                        setError(null);
                        // Delay state cleanup to prevent unmount issues
                        setTimeout(() => {
                          setShowOtpInput(false);
                          localStorage.removeItem('showOtpInput');
                        }, 0);
                      }}
                      disabled={loading}
                    >
                      Back to Email/Phone
                    </Button>
                    {showResendButton && (
                      <Button
                        fullWidth
                        onClick={() => {
                          setShowResendButton(false);
                          handleSendOtp();
                        }}
                        disabled={loading}
                      >
                        Resend OTP
                      </Button>
                    )}
                  </Stack>
                </>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSendOtp}
                  disabled={loading || !emailOrPhone}
                >
                  {loading ? <CircularProgress size={24} /> : 'Send OTP'}
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
