import React, { useEffect, useState } from 'react';
import { Avatar, IconButton, Typography, Box, Badge, Menu, MenuItem, ListItemIcon, ListItemText, Divider, CircularProgress, Tooltip, Button } from '@mui/material';
import { FaUser, FaHeart, FaEnvelope } from 'react-icons/fa';
import { MdLogout, MdFlashOn, MdHome } from 'react-icons/md'; // New Icons
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion'; // Import framer-motion

import { IoMdNotifications } from "react-icons/io";
import { disconnectSocket, connectSocket, addSocketListener } from '../api';
import { getPosts } from '../actions/post';
import { getNotifications, addNewNotification, markAsRead } from '../actions/notification';

// Animation for the shimmering text effect on hover
const shimmerKeyframes = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const Navbar = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('profile')));
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { notifications, unreadCount, isLoading } = useSelector((state) => state.notifications);

  const logoutHandler = () => {
   
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('profile');
    setUser(null);
    disconnectSocket();
    dispatch({ type: 'FETCH_USERS_SUCCESS', payload: [] });
    navigate('/posts');
  };
 
  
  // Combine all user-related effects into one
  useEffect(() => {
    const profileData = localStorage.getItem('profile');
    if (!profileData) {
      setUser(null);
      disconnectSocket();
      return;
    }
    const userData = JSON.parse(profileData);
    if (userData?.accessToken) {
        try {
            const decodedToken = jwtDecode(userData.accessToken);
            if (decodedToken.exp * 1000 < new Date().getTime()) {
                logoutHandler(); // Use the handler which already includes navigation etc.
                return;
            }
        } catch(e) {
            logoutHandler();
            return;
        }
    }
    setUser(userData);
    if (userData?.result?._id) {
        connectSocket();
        dispatch(getNotifications());
        addSocketListener('newNotification', (notification) => {
            dispatch(addNewNotification(notification));
        });
    }
  }, [location, dispatch]);

  const clickLogo = () => {
    dispatch(getPosts(1));
    navigate('/posts');
  };

  const handleNotificationClick = (event) => setAnchorEl(event.currentTarget);
  const handleNotificationClose = () => setAnchorEl(null);

  const handleNotificationItemClick = (notification) => {
    if (!notification.read) dispatch(markAsRead(notification._id));
    handleNotificationClose();
    if (notification.type === 'message' && notification.sender?._id) {
      navigate(`/chat`);
    }
  };
  
  const handleProfileClick = () => {
    if(user?.result?._id) navigate(`/posts/profile/${user.result._id}`);
  }

  // Framer Motion animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={navbarVariants} initial="hidden" animate="visible">
      <style>{shimmerKeyframes}</style>
      <Box sx={{
          background: 'rgba(13, 13, 27, 0.7)', // Dark, glassy background
          backdropFilter: 'blur(15px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 4 },
          py: 1.5,
          position: 'fixed', // Changed from sticky for better layering
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100, // High z-index to be above all content
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
        
        {/* Logo and Brand Name */}
        <motion.div variants={itemVariants} transition={{ delay: 0.1 }}>
          <Link to="/posts" onClick={clickLogo} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ type: "spring", stiffness: 300 }}>
              <IconButton sx={{ background: 'linear-gradient(45deg, #00FFFF, #2E73E8)', color: 'black', width: 48, height: 48 }}>
                <MdFlashOn size={28} />
              </IconButton>
            </motion.div>
            <Typography variant="h5" sx={{ 
              fontWeight: 700,
              color: 'white',
              position: 'relative',
              '&:hover::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
                  animation: 'shimmer 1.5s infinite',
              }
            }}>
              Connectify
            </Typography>
          </Link>
        </motion.div>
        
        {/* User Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              {/* Home and Notification Buttons */}
              <motion.div variants={itemVariants} transition={{ delay: 0.2 }}>
                <Tooltip title="Home">
                  <IconButton onClick={clickLogo} sx={{ color: 'white',}}><MdHome size={24} /></IconButton>
                </Tooltip>
              </motion.div>

              <motion.div variants={itemVariants} transition={{ delay: 0.3 }}>
                <Tooltip title="Notifications">
                  <IconButton onClick={handleNotificationClick} sx={{ color: 'white' }}>
                    <Badge badgeContent={unreadCount} color="error"><IoMdNotifications size={24} /></Badge>
                  </IconButton>
                </Tooltip>
              </motion.div>

              {/* User Avatar and Name */}
              <motion.div variants={itemVariants} transition={{ delay: 0.4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: '24px', background: 'rgba(255, 255, 255, 0.1)', cursor: 'pointer', '&:hover': { background: 'rgba(255, 255, 255, 0.2)' } }}>
                  <Avatar onClick={handleProfileClick} sx={{ width: 32, height: 32, bgcolor: '#00FFFF', color: '#000' }}>
                    {user.result.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography onClick={handleProfileClick} sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 600 }}>
                    {user.result.name}
                  </Typography>
                  <Tooltip title="Logout">
                     <IconButton onClick={logoutHandler} size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#F87171', background: 'rgba(248, 113, 113, 0.1)' } }}>
                       <MdLogout />
                     </IconButton>
                  </Tooltip>
                </Box>
              </motion.div>
            </>
          ) : (
            // Sign In Button
            <motion.div variants={itemVariants} transition={{ delay: 0.2 }}>
              <Button variant="contained" onClick={() => navigate('/auth')} sx={{ background: 'linear-gradient(45deg, #00FFFF, #2E73E8)', color: '#000', fontWeight: 'bold', borderRadius: '20px' }}>
                Sign In
              </Button>
            </motion.div>
          )}
        </Box>
        
        {/* Notification Popover Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleNotificationClose} PaperProps={{ sx: { mt: 1.5, width: '320px', bgcolor: 'rgba(28, 28, 45, 0.9)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}}>
          <Typography variant="h6" sx={{ px: 2, py: 1 }}>Notifications</Typography>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress sx={{color: '#00FFFF'}}/></Box>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem key={notification._id} onClick={() => handleNotificationItemClick(notification)} sx={{ fontWeight: notification.read ? 'normal' : 'bold', whiteSpace: 'normal', '&:hover': { backgroundColor: 'rgba(0, 255, 255, 0.1)'} }}>
                <ListItemIcon sx={{ color: 'white' }}>{notification.type === 'like' ? <FaHeart color="#f472b6" /> : <FaEnvelope color="#60a5fa" />}</ListItemIcon>
                <ListItemText primary={notification.message} />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled><ListItemText primary="No new notifications" /></MenuItem>
          )}
        </Menu>
      </Box>
    </motion.div>
  );
};

export default Navbar;