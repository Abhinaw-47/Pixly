import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton, Button, Paper, Divider, Fade, LinearProgress, Avatar } from '@mui/material';
import { FaUser, FaEnvelope, FaLock, FaRedo, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdFlashOn } from 'react-icons/md';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { googleSignin, signIn, signUp, verifyOtp } from '../actions/auth';
import Background from './Background'; 
import Footer from './Footer'; 


const OtpForm = ({ userId, isLoading, setIsLoading, commonTextFieldProps, onBack }) => {
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        
       
        if (!otp) {
            setOtpError('Please enter the OTP');
            return;
        }
        if (otp.length !== 6) {
            setOtpError('OTP must be 6 digits');
            return;
        }
        if (!/^\d+$/.test(otp)) {
            setOtpError('OTP must contain only numbers');
            return;
        }
        
        setOtpError('');
        setIsLoading(true);
        
        try {
            await dispatch(verifyOtp({ userId, otp }, navigate));
        } catch (error) {
            console.error('OTP verification error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); 
        if (value.length <= 6) {
            setOtp(value);
            setOtpError('');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Check Your Email</Typography>
                <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
                    We've sent a 6-digit OTP to your email address.
                </Typography>
            </Box>
            <Box component="form" onSubmit={handleOtpSubmit}>
                <TextField 
                    name="otp" 
                    placeholder="Enter 6-Digit OTP" 
                    value={otp}
                    onChange={handleOtpChange} 
                    fullWidth 
                    sx={{ mb: 2 }} 
                    disabled={isLoading}
                    error={!!otpError}
                    helperText={otpError}
                    inputProps={{ 
                        maxLength: 6,
                        style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.5rem' }
                    }}
                    {...commonTextFieldProps}
                />
                <Button 
                    fullWidth 
                    type="submit" 
                    disabled={isLoading || !otp || otp.length !== 6} 
                    sx={{ 
                        mt: 2, 
                        py: 1.5, 
                        fontWeight: 700, 
                        fontSize: '1rem', 
                        borderRadius: '12px', 
                        background: 'linear-gradient(45deg, #00FFFF, #2E73E8)', 
                        color: '#000',
                        '&:disabled': {
                            background: 'rgba(255, 255, 255, 0.3)',
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    }}
                >
                    {isLoading ? 'Verifying...' : 'Verify & Login'}
                </Button>
                
                <Button
                    fullWidth
                    variant="text"
                    onClick={onBack}
                    disabled={isLoading}
                    sx={{ 
                        mt: 2, 
                        color: '#00FFFF', 
                        fontWeight: 700, 
                        textTransform: 'none' 
                    }}
                >
                    Back to Sign Up
                </Button>
            </Box>
        </motion.div>
    );
};

const Auth = () => {
    // State to manage which form to show: 'signIn', 'signUp', or 'otp'
    const [authMode, setAuthMode] = useState('signIn'); 
    const [userIdForVerification, setUserIdForVerification] = useState(null);
    
    const [formData, setFormData] = useState({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        
        if (formErrors[e.target.name]) {
            setFormErrors(prev => ({
                ...prev,
                [e.target.name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (authMode === 'signUp') {
            if (!formData.firstName.trim()) errors.firstName = 'First name is required';
            if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        }
        
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            errors.password = 'Password is required';
        } 
        
        if (authMode === 'signUp') {
            if (!formData.confirmPassword) {
                errors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        try {
            if (authMode === 'signUp') {
                await dispatch(signUp(formData, navigate, (id) => {
                    setUserIdForVerification(id);
                    setAuthMode('otp'); 
                }));
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
        setAuthMode(authMode === 'signIn' ? 'signUp' : 'signIn');
        setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
        setFormErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleBackToSignUp = () => {
        setAuthMode('signUp');
        setUserIdForVerification(null);
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
        FormHelperTextProps: { sx: { color: '#ff6b6b' } },
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
                                marginTop: "100px"
                            }}
                        >
                            {isLoading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, '& .MuiLinearProgress-bar': { background: 'linear-gradient(45deg, #00FFFF, #2E73E8)' } }} />}
                            
                            {/* --- CONDITIONAL RENDERING LOGIC --- */}
                            {authMode === 'otp' ? (
                                <OtpForm 
                                    userId={userIdForVerification} 
                                    isLoading={isLoading} 
                                    setIsLoading={setIsLoading} 
                                    commonTextFieldProps={commonTextFieldProps}
                                    onBack={handleBackToSignUp}
                                />
                            ) : (
                                <>
                                    <motion.div variants={itemVariants}>
                                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                                            <motion.div whileHover={{ scale: 1.1, rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                                                <Avatar sx={{ width: 70, height: 70, mx: 'auto', mb: 2, background: 'linear-gradient(45deg, #00FFFF, #2E73E8)', color: '#000' }}>
                                                    <MdFlashOn size={40} />
                                                </Avatar>
                                            </motion.div>
                                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                                {authMode === 'signUp' ? 'Create Account' : 'Welcome Back'}
                                            </Typography>
                                            <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
                                                {authMode === 'signUp' ? 'Join the community' : 'Sign in to continue'}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                    
                                    <Box component="form" onSubmit={handleSubmit}>
                                        <motion.div variants={itemVariants}>
                                            {authMode === 'signUp' && (
                                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                    <TextField 
                                                        name="firstName" 
                                                        placeholder="First Name" 
                                                        value={formData.firstName}
                                                        onChange={handleChange} 
                                                        error={!!formErrors.firstName}
                                                        helperText={formErrors.firstName}
                                                        {...commonTextFieldProps} 
                                                        InputProps={{
                                                            ...commonTextFieldProps.InputProps, 
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <FaUser size={16} color="rgba(255, 255, 255, 0.6)" />
                                                                </InputAdornment>
                                                            )
                                                        }} 
                                                    />
                                                    <TextField 
                                                        name="lastName" 
                                                        placeholder="Last Name" 
                                                        value={formData.lastName}
                                                        onChange={handleChange} 
                                                        error={!!formErrors.lastName}
                                                        helperText={formErrors.lastName}
                                                        {...commonTextFieldProps} 
                                                        InputProps={{
                                                            ...commonTextFieldProps.InputProps, 
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <FaUser size={16} color="rgba(255, 255, 255, 0.6)" />
                                                                </InputAdornment>
                                                            )
                                                        }} 
                                                    />
                                                </Box>
                                            )}
                                        </motion.div>
                                        
                                        <motion.div variants={itemVariants}>
                                            <TextField 
                                                name="email" 
                                                placeholder="Email Address" 
                                                type="email" 
                                                value={formData.email}
                                                onChange={handleChange} 
                                                error={!!formErrors.email}
                                                helperText={formErrors.email}
                                                sx={{ mb: 2 }} 
                                                {...commonTextFieldProps} 
                                                InputProps={{
                                                    ...commonTextFieldProps.InputProps, 
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <FaEnvelope size={16} color="rgba(255, 255, 255, 0.6)" />
                                                        </InputAdornment>
                                                    )
                                                }} 
                                            />
                                        </motion.div>
                                        
                                        <motion.div variants={itemVariants}>
                                            <TextField 
                                                name="password" 
                                                placeholder="Password" 
                                                type={showPassword ? 'text' : 'password'} 
                                                value={formData.password}
                                                onChange={handleChange} 
                                                error={!!formErrors.password}
                                                helperText={formErrors.password}
                                                sx={{ mb: 2 }} 
                                                {...commonTextFieldProps} 
                                                InputProps={{
                                                    ...commonTextFieldProps.InputProps, 
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <FaLock size={16} color="rgba(255, 255, 255, 0.6)" />
                                                        </InputAdornment>
                                                    ), 
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }} 
                                            />
                                        </motion.div>
                                        
                                        {authMode === 'signUp' && (
                                            <motion.div variants={itemVariants}>
                                                <TextField 
                                                    name="confirmPassword" 
                                                    placeholder="Confirm Password" 
                                                    type={showConfirmPassword ? 'text' : 'password'} 
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange} 
                                                    error={!!formErrors.confirmPassword}
                                                    helperText={formErrors.confirmPassword}
                                                    sx={{ mb: 2 }} 
                                                    {...commonTextFieldProps} 
                                                    InputProps={{
                                                        ...commonTextFieldProps.InputProps, 
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <FaRedo size={16} color="rgba(255, 255, 255, 0.6)" />
                                                            </InputAdornment>
                                                        ), 
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }} 
                                                />
                                            </motion.div>
                                        )}
                                        
                                        <motion.div variants={itemVariants}>
                                            <Button 
                                                fullWidth 
                                                type="submit" 
                                                disabled={isLoading} 
                                                sx={{ 
                                                    mt: 2, 
                                                    py: 1.5, 
                                                    fontWeight: 700, 
                                                    fontSize: '1rem', 
                                                    borderRadius: '12px', 
                                                    background: 'linear-gradient(45deg, #00FFFF, #2E73E8)', 
                                                    color: '#000', 
                                                    '&:hover': { background: 'linear-gradient(45deg, #00E0E0, #1F63D8)' },
                                                    '&:disabled': {
                                                        background: 'rgba(255, 255, 255, 0.3)',
                                                        color: 'rgba(255, 255, 255, 0.5)'
                                                    }
                                                }}
                                            >
                                                {isLoading ? 'Processing...' : (authMode === 'signUp' ? 'Sign Up' : 'Sign In')}
                                            </Button>
                                        </motion.div>
                                        
                                        <motion.div variants={itemVariants}>
                                            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }}>
                                                <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">OR</Typography>
                                            </Divider>
                                        </motion.div>
                                        
                                        <motion.div variants={itemVariants}>
                                            <Box display="flex" justifyContent="center">
                                                <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                                                    <GoogleLogin 
                                                        onSuccess={handleGoogleSuccess} 
                                                        onError={handleGoogleError} 
                                                        theme="outline" 
                                                        size="large" 
                                                        shape="rectangular" 
                                                    />
                                                </GoogleOAuthProvider>
                                            </Box>
                                        </motion.div>
                                        
                                        <motion.div variants={itemVariants}>
                                            <Typography variant="body2" align="center" sx={{ mt: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                                                {authMode === 'signUp' ? 'Already have an account? ' : "Don't have an account? "}
                                                <Button 
                                                    variant="text" 
                                                    onClick={switchMode} 
                                                    disabled={isLoading} 
                                                    sx={{ color: '#00FFFF', fontWeight: 700, textTransform: 'none' }}
                                                >
                                                    {authMode === 'signUp' ? 'Sign In' : 'Sign Up'}
                                                </Button>
                                            </Typography>
                                        </motion.div>
                                    </Box>
                                </>
                            )}
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