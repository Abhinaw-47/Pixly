import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Paper,
  Divider,
  Fade,
  Slide,
  Zoom,
  LinearProgress,
} from '@mui/material';
import { FaUser, FaEnvelope, FaLock, FaRedo, FaEye, FaEyeSlash, FaRocket } from 'react-icons/fa';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { googleSignin, signIn, signUp } from '../actions/auth';
import { keyframes } from '@mui/system';

const floatForm = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotateY(0deg);
  }
  25% { 
    transform: translateY(-10px) rotateY(1deg);
  }
  50% { 
    transform: translateY(-5px) rotateY(-1deg);
  }
  75% { 
    transform: translateY(-15px) rotateY(0.5deg);
  }
`;

const shimmerBackground = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(147, 51, 234, 0.4),
                0 0 40px rgba(59, 130, 246, 0.2),
                inset 0 0 20px rgba(147, 51, 234, 0.1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(147, 51, 234, 0.6),
                0 0 60px rgba(59, 130, 246, 0.4),
                inset 0 0 30px rgba(147, 51, 234, 0.2);
  }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px) rotateY(-15deg);
  }
  to {
    opacity: 1;
    transform: translateX(0) rotateY(0deg);
  }
`;

const Auth = () => {
  const [postData, setPostData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) =>
    setPostData({ ...postData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        await dispatch(signUp(postData, navigate));
      } else {
        await dispatch(signIn(postData, navigate));
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (res) => {
    const credential = res.credential;
    const decoded = jwtDecode(credential);
    dispatch(googleSignin({ token: credential, user: decoded }, navigate));
  };

  const handleGoogleError = (error) => {
    console.error('Google Sign In failed:', error);
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setPostData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #000000 0%, #1a0033 25%, #2a003f 50%, #1a0033 75%, #000000 100%)
        `,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        py: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
    
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              background: `rgba(147, 51, 234, ${0.3 + Math.random() * 0.4})`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `${sparkle} ${3 + i * 0.2}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </Box>

      <Fade in={mounted} timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: '30px',
            width: '100%',
            maxWidth: 450,
            background: `
              linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)),
              linear-gradient(45deg, transparent 30%, rgba(147, 51, 234, 0.1) 50%, transparent 70%)
            `,
            backdropFilter: 'blur(25px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            animation: `${floatForm} 8s ease-in-out infinite`,
            transition: 'all 0.3s ease',
            '&:hover': {
              animation: 'none',
              transform: 'translateY(-10px) rotateY(2deg)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: `
                linear-gradient(
                  90deg, 
                  transparent, 
                  rgba(255, 255, 255, 0.1), 
                  transparent
                )
              `,
              animation: `${shimmerBackground} 3s ease-in-out infinite`,
            },
          }}
        >
         
          {isLoading && (
            <LinearProgress 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                borderRadius: '30px 30px 0 0',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(45deg, #9333ea, #3b82f6)',
                },
              }}
            />
          )}

          {/* Header */}
          <Slide direction="down" in={mounted} timeout={800} style={{ transitionDelay: '200ms' }}>
            <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
                <Box
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #9333ea, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: `${pulseGlow} 3s ease-in-out infinite`,
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  transform: mounted ? 'scale(1)' : 'scale(0)',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
                }}
              >
                <FaRocket size={32} color="white" />
              </Box>
              
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  background: 'linear-gradient(45deg, #ffffff, #e0e0ff)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {isSignUp ? 'Join CONNECTIFY' : 'Welcome Back'}
              </Typography>
              
              <Typography
                variant="body1"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 300,
                }}
              >
                {isSignUp ? 'Create your account and start connecting' : 'Sign in to continue your journey'}
              </Typography>
            </Box>
          </Slide>

        
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              position: 'relative', 
              zIndex: 1,
              '& .MuiTextField-root': {
                animation: `${slideIn} 0.6s ease-out`,
              },
            }}
          >
            {isSignUp && (
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Slide direction="right" in={isSignUp} timeout={600}>
                  <TextField
                    fullWidth
                    name="firstName"
                    placeholder="First Name"
                    value={postData.firstName}
                    onChange={handleChange}
                    variant="outlined"
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaUser size={16} color="rgba(255, 255, 255, 0.6)" />
                        </InputAdornment>
                      ),
                      sx: { 
                        color: '#fff',
                        borderRadius: '15px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.08)',
                        },
                        '&.Mui-focused': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 0 0 2px rgba(147, 51, 234, 0.3)',
                        },
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(147, 51, 234, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#9333ea',
                        },
                      },
                    }}
                    InputLabelProps={{
                      sx: { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  />
                </Slide>
                
                <Slide direction="left" in={isSignUp} timeout={600} style={{ transitionDelay: '100ms' }}>
                  <TextField
                    fullWidth
                    name="lastName"
                    placeholder="Last Name"
                    value={postData.lastName}
                    onChange={handleChange}
                    variant="outlined"
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaUser size={16} color="rgba(255, 255, 255, 0.6)" />
                        </InputAdornment>
                      ),
                      sx: { 
                        color: '#fff',
                        borderRadius: '15px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.08)',
                        },
                        '&.Mui-focused': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 0 0 2px rgba(147, 51, 234, 0.3)',
                        },
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(147, 51, 234, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#9333ea',
                        },
                      },
                    }}
                  />
                </Slide>
              </Box>
            )}

            <Slide direction="up" in={mounted} timeout={600} style={{ transitionDelay: '300ms' }}>
              <TextField
                fullWidth
                name="email"
                placeholder="Email Address"
                value={postData.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                type="email"
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaEnvelope size={16} color="rgba(255, 255, 255, 0.6)" />
                    </InputAdornment>
                  ),
                  sx: { 
                    color: '#fff',
                    borderRadius: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-focused': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 0 0 2px rgba(147, 51, 234, 0.3)',
                    },
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(147, 51, 234, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#9333ea',
                    },
                  },
                }}
              />
            </Slide>

            <Slide direction="up" in={mounted} timeout={600} style={{ transitionDelay: '400ms' }}>
              <TextField
                fullWidth
                name="password"
                placeholder="Password"
                value={postData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock size={16} color="rgba(255, 255, 255, 0.6)" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                      >
                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { 
                    color: '#fff',
                    borderRadius: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-focused': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 0 0 2px rgba(147, 51, 234, 0.3)',
                    },
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(147, 51, 234, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#9333ea',
                    },
                  },
                }}
              />
            </Slide>

            {isSignUp && (
              <Slide direction="up" in={isSignUp} timeout={600} style={{ transitionDelay: '500ms' }}>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={postData.confirmPassword}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  type={showConfirmPassword ? 'text' : 'password'}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaRedo size={16} color="rgba(255, 255, 255, 0.6)" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                        >
                          {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { 
                      color: '#fff',
                      borderRadius: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.08)',
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 0 0 2px rgba(147, 51, 234, 0.3)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(147, 51, 234, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#9333ea',
                      },
                    },
                  }}
                />
              </Slide>
            )}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
              sx={{
                mt: 4,
                py: 2,
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: '15px',
                background: 'linear-gradient(45deg, #9333ea, #3b82f6)',
                position: 'relative',
                overflow: 'hidden',
                transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                opacity: mounted ? 1 : 0,
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7e22ce, #2563eb)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 15px 35px rgba(147, 51, 234, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.5)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: `
                    linear-gradient(
                      90deg, 
                      transparent, 
                      rgba(255, 255, 255, 0.2), 
                      transparent
                    )
                  `,
                  transition: 'left 0.6s',
                },
                '&:hover::before': {
                  left: '100%',
                },
              }}
            >
              {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>

          
            <Fade in={mounted} timeout={800} style={{ transitionDelay: '700ms' }}>
              <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  or continue with
                </Typography>
              </Divider>
            </Fade>

           
            <Box 
              display="flex" 
              justifyContent="center"
              sx={{
                transform: mounted ? 'scale(1)' : 'scale(0.8)',
                opacity: mounted ? 1 : 0,
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s',
                '& > div': {
                  borderRadius: '15px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 25px rgba(66, 133, 244, 0.3)',
                  },
                },
              }}
            >
               <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
                shape="rectangular"
              />
              </GoogleOAuthProvider>
            </Box>

          
            <Slide direction="up" in={mounted} timeout={800} style={{ transitionDelay: '900ms' }}>
              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 4, color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {isSignUp
                  ? 'Already have an account? '
                  : "Don't have an account? "}
                <Button
                  variant="text"
                  onClick={switchMode}
                  disabled={isLoading}
                  sx={{
                    color: '#60a5fa',
                    fontWeight: 700,
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      background: 'rgba(96, 165, 250, 0.1)',
                      transform: 'scale(1.05)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'linear-gradient(45deg, #3b82f6, #60a5fa)',
                      transform: 'scaleX(0)',
                      transition: 'transform 0.3s ease',
                    },
                    '&:hover::before': {
                      transform: 'scaleX(1)',
                    },
                  }}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Button>
              </Typography>
            </Slide>
          </Box>

          {/* Footer */}
          <Fade in={mounted} timeout={1000} style={{ transitionDelay: '1000ms' }}>
            <Typography
              variant="caption"
              align="center"
              display="block"
              sx={{ 
                mt: 4, 
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.75rem',
              }}
            >
              © 2025 CONNECTIFY. All rights reserved.
            </Typography>
          </Fade>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Auth;