import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton, Button, Paper, Divider, Fade, LinearProgress, Avatar } from '@mui/material';
import { FaUser, FaEnvelope, FaLock, FaRedo, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdFlashOn } from 'react-icons/md';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { googleSignin, signIn, signUp } from '../actions/auth';
import Background from './Background'; 
import Footer from './Footer'; 

const Auth = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        await dispatch(signUp(formData, navigate));
      } else {
        await dispatch(signIn(formData, navigate));
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

  const handleGoogleError = (error) => console.error('Google Sign In failed:', error);

  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const commonTextFieldProps = {
    variant: "outlined",
    fullWidth: true,
    disabled: isLoading,
    InputProps: {
      sx: {
        color: '#fff',
        borderRadius: '12px',
        background: 'rgba(28, 28, 45, 0.7)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 255, 255, 0.5)' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00FFFF' },
        '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      },
    },
    InputLabelProps: { sx: { color: 'rgba(255, 255, 255, 0.7)' } },
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <Background />
      <Box sx={{ zIndex: 1, width: '100%', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5 }}>
        <Fade in timeout={1000}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Paper
              elevation={0}
              sx={{
                p: {xs: 3, sm: 5},
                borderRadius: '24px',
                width: '100%',
                maxWidth: 450,
                background: 'rgba(13, 13, 27, 0.7)',
                backdropFilter: 'blur(15px)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                marginTop:"100px"
              }}
            >
              {isLoading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, '& .MuiLinearProgress-bar': { background: 'linear-gradient(45deg, #00FFFF, #2E73E8)' } }} />}
              
              <motion.div variants={itemVariants}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <motion.div whileHover={{ scale: 1.1, rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Avatar sx={{ width: 70, height: 70, mx: 'auto', mb: 2, background: 'linear-gradient(45deg, #00FFFF, #2E73E8)', color: '#000' }}>
                      <MdFlashOn size={40} />
                    </Avatar>
                  </motion.div>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                  </Typography>
                  <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
                    {isSignUp ? 'Join the community' : 'Sign in to continue'}
                  </Typography>
                </Box>
              </motion.div>
              
              <Box component="form" onSubmit={handleSubmit}>
                <motion.div variants={itemVariants}>
                  {isSignUp && (
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField name="firstName" placeholder="First Name" onChange={handleChange} {...commonTextFieldProps} InputProps={{...commonTextFieldProps.InputProps, startAdornment: (<InputAdornment position="start"><FaUser size={16} color="rgba(255, 255, 255, 0.6)" /></InputAdornment>)}} />
                      <TextField name="lastName" placeholder="Last Name" onChange={handleChange} {...commonTextFieldProps} InputProps={{...commonTextFieldProps.InputProps, startAdornment: (<InputAdornment position="start"><FaUser size={16} color="rgba(255, 255, 255, 0.6)" /></InputAdornment>)}} />
                    </Box>
                  )}
                </motion.div>
                <motion.div variants={itemVariants}>
                  <TextField name="email" placeholder="Email Address" type="email" onChange={handleChange} sx={{ mb: 2 }} {...commonTextFieldProps} InputProps={{...commonTextFieldProps.InputProps, startAdornment: (<InputAdornment position="start"><FaEnvelope size={16} color="rgba(255, 255, 255, 0.6)" /></InputAdornment>)}} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <TextField name="password" placeholder="Password" type={showPassword ? 'text' : 'password'} onChange={handleChange} sx={{ mb: 2 }} {...commonTextFieldProps} InputProps={{...commonTextFieldProps.InputProps, startAdornment: (<InputAdornment position="start"><FaLock size={16} color="rgba(255, 255, 255, 0.6)" /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>{showPassword ? <FaEyeSlash /> : <FaEye />}</IconButton></InputAdornment>)}} />
                </motion.div>
                {isSignUp && (
                  <motion.div variants={itemVariants}>
                    <TextField name="confirmPassword" placeholder="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} onChange={handleChange} sx={{ mb: 2 }} {...commonTextFieldProps} InputProps={{...commonTextFieldProps.InputProps, startAdornment: (<InputAdornment position="start"><FaRedo size={16} color="rgba(255, 255, 255, 0.6)" /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</IconButton></InputAdornment>)}} />
                  </motion.div>
                )}
                <motion.div variants={itemVariants}>
                  <Button fullWidth type="submit" disabled={isLoading} sx={{ mt: 2, py: 1.5, fontWeight: 700, fontSize: '1rem', borderRadius: '12px', background: 'linear-gradient(45deg, #00FFFF, #2E73E8)', color: '#000', '&:hover': { background: 'linear-gradient(45deg, #00E0E0, #1F63D8)' } }}>
                    {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                  </Button>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }}><Typography variant="body2" color="rgba(255, 255, 255, 0.6)">OR</Typography></Divider>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Box display="flex" justifyContent="center">
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                      <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} theme="outline" size="large" shape="rectangular" />
                    </GoogleOAuthProvider>
                  </Box>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Typography variant="body2" align="center" sx={{ mt: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <Button variant="text" onClick={switchMode} disabled={isLoading} sx={{ color: '#00FFFF', fontWeight: 700, textTransform: 'none' }}>
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </Button>
                  </Typography>
                </motion.div>
              </Box>
            </Paper>
          </motion.div>
        </Fade>
      </Box>
      <Box sx={{ zIndex: 1, width: '100%' }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Auth;