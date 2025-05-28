import React, { useEffect, useState } from 'react';
import logo from '../images/logo.png';
import { Avatar } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { disconnectSocket, connectSocket } from '../api';

// Consistent styling constants matching the Chat component theme
const COLORS = {
  primary: '#3b82f6', // Blue-500
  primaryHover: '#2563eb', // Blue-600
  primaryLight: 'rgba(59, 130, 246, 0.1)',
  gradient: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)',
  cardBg: 'rgba(31, 41, 55, 0.8)',
  text: '#ffffff',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  danger: '#ef4444',
  dangerLight: 'rgba(239, 68, 68, 0.1)',
  success: '#10b981',
  background: '#111827',
  overlay: 'rgba(0, 0, 0, 0.5)',
  border: 'rgba(75, 85, 99, 0.3)',
  shadow: 'rgba(0, 0, 0, 0.25)',
  glass: 'rgba(255, 255, 255, 0.05)'
};

const Navbar = () => {
  const [user, setUser] = useState(() => {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(profile) : null;
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Token validation and user state management
  useEffect(() => {
    const profile = localStorage.getItem('profile');
    const userData = profile?.length>0 ? JSON.parse(profile) : null;
   
    
    if (userData?.token) {
      try {
        const decodedData = jwtDecode(userData.token);
        if (decodedData.exp * 1000 < new Date().getTime()) {
          logoutHandler();
          return;
        }
       

      console.log('going to conncect socket')
        
      connectSocket();
        

      } catch (error) {
        console.error('Token decode error:', error);
        logoutHandler();
        return;
      }
    }
    
    setUser(userData);
  }, [location]);

  const logoutHandler = () => {
    try {
      dispatch({ type: 'LOGOUT' });
      
      localStorage.removeItem('profile');
      setUser(null);
      disconnectSocket()
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", damping: 25 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        background: COLORS.gradient,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${COLORS.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: `0 8px 32px ${COLORS.shadow}`
      }}
    >
      {/* Logo Section */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <motion.div
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              padding: '8px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img 
              src={logo} 
              alt="Pixly Logo" 
              style={{ 
                width: '40px', 
                height: '40px',
                filter: 'brightness(1.1)'
              }}
            />
          </motion.div>
          <motion.h1 
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '28px',
              fontWeight: '800',
              letterSpacing: '0.5px',
              margin: 0
            }}
          >
            Pixly
          </motion.h1>
        </motion.div>
      </Link>

      {/* Authentication Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <>
            {/* User Avatar and Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Avatar
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: COLORS.text,
                    width: 40,
                    height: 40,
                    fontWeight: '700',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }}
                  alt={user?.result?.name || 'User'}
                >
                  {user?.result?.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </motion.div>
              <span style={{
                color: COLORS.textSecondary,
                fontWeight: '600',
                fontSize: '15px',
                maxWidth: '140px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user?.result?.name || 'User'}
              </span>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={logoutHandler}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: `linear-gradient(135deg, ${COLORS.danger}, #dc2626)`,
                color: COLORS.text,
                padding: '10px 16px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '14px',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                cursor: 'pointer',
                border: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <FaSignOutAlt size={14} />
              Sign Out
            </motion.button>
          </>
        ) : (
          <Link to="/auth" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 12px 30px rgba(59, 130, 246, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: COLORS.text,
                padding: '12px 24px',
                borderRadius: '16px',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                cursor: 'pointer',
                border: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                }}
                animate={{
                  left: ['100%', '-100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
              Sign In
            </motion.button>
          </Link>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;