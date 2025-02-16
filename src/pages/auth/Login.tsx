import React, { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../../store/authStore';
import { auth } from '../../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showResendButton, setShowResendButton] = useState(false);
  const [authSuccessful, setAuthSuccessful] = useState(false);

  const { loginWithFirebase, loginWithOtp, verifyOtp, loading } = useAuth();
  const { otpFlow, setOtpFlowState, clearOtpFlow } = useAuthStore();
  const navigate = useNavigate();

  // Show resend button after 30 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpFlow.showOtp) {
      timer = setTimeout(() => {
        setShowResendButton(true);
      }, 30000);
    } else {
      setShowResendButton(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [otpFlow.showOtp]);

  // Clean up on unmount if auth was not successful
  useEffect(() => {
    return () => {
      console.log('Login: Cleanup effect running', {
        authSuccessful
      });

      if (!authSuccessful) {
        console.log('Login: Cleaning up OTP flow - not a successful auth');
        clearOtpFlow();
      } else {
        console.log('Login: Preserving OTP flow - successful auth');
      }
    };
  }, [clearOtpFlow, authSuccessful]);

  const handleGoogleLogin = async () => {
    try {
      console.log('Login: Starting Google login flow');
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      
      console.log('Login: Got Firebase token, authenticating with backend');
      await loginWithFirebase(token);
      
      console.log('Login: Firebase auth successful, checking state before navigation');
      const currentUser = useAuthStore.getState().user;
      const isAuth = useAuthStore.getState().isAuthenticated;
      console.log('Login: Auth state after Firebase login:', {
        hasUser: !!currentUser,
        isAuthenticated: isAuth,
        userRole: currentUser?.role
      });

      setAuthSuccessful(true);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login: Google login error:', err);
      setError('Failed to login with Google. Please try again.');
    }
  };

  const handleSendOtp = useCallback(async () => {
    if (!otpFlow.email) return;

    try {
      console.log('Login: Sending OTP for:', otpFlow.email);
      setError(null);
      const success = await loginWithOtp(otpFlow.email);
      console.log('Login: OTP send result:', success);
      
      if (success) {
        setError('OTP sent successfully! For testing, use: 123456');
      }
    } catch (err) {
      console.log('Login: Error sending OTP:', err);
      setError('Failed to send OTP. Please try again.');
      clearOtpFlow();
      console.error(err);
    }
  }, [otpFlow.email, loginWithOtp, clearOtpFlow]);

  const handleVerifyOtp = async () => {
    if (!otp) return;

    try {
      console.log('Login: Starting OTP verification');
      setError(null);
      await verifyOtp(otp);
      
      // Set auth successful before navigation
      setAuthSuccessful(true);
      
      // Small delay to ensure state updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Login: OTP verification successful, navigating to dashboard');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.log('Login: OTP verification error:', err);
      // Just clear the OTP field on error, keep the OTP input visible
      setOtp('');
      setError('Invalid OTP. Please try again. (Hint: Use 123456)');
      // Force ensure OTP input stays visible
      setOtpFlowState(otpFlow.email, true);
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
                value={otpFlow.email}
                onChange={(e) => setOtpFlowState(e.target.value, false)}
                disabled={otpFlow.showOtp || loading}
              />

              {otpFlow.showOtp ? (
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
                helperText={`Enter the 6-digit OTP sent to ${otpFlow.email}`}
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
                        clearOtpFlow();
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
                  disabled={loading || !otpFlow.email}
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
