import React, { useEffect, useState } from 'react';
import { Avatar, IconButton, Typography, Box, Badge, Menu, MenuItem, ListItemIcon, ListItemText, Divider, CircularProgress, Tooltip, Button } from '@mui/material';
import { FaUser, FaHeart, FaEnvelope } from 'react-icons/fa';
import { MdLogout, MdFlashOn, MdHome } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';

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
                logoutHandler();
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
          background: 'rgba(13, 13, 27, 0.7)',
          backdropFilter: 'blur(15px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 4 },
          py: 1.5,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
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
        
        {/* Notification Popover Menu with Scrolling */}
        <Menu 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={handleNotificationClose} 
          PaperProps={{ 
            sx: { 
              mt: 1.5, 
              width: '320px', 
              maxHeight: '400px', // Set maximum height
              bgcolor: 'rgba(28, 28, 45, 0.9)', 
              color: 'white', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              overflow: 'hidden' // Hide overflow to allow internal scrolling
            }
          }}
          MenuListProps={{
            sx: {
              padding: 0, // Remove default padding
              maxHeight: '340px', // Leave space for header
              overflowY: 'auto', // Enable vertical scrolling
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0, 255, 255, 0.4)',
                borderRadius: '10px',
                '&:hover': {
                  background: 'rgba(0, 255, 255, 0.6)'
                }
              }
            }
          }}
        >
          {/* Fixed Header */}
          <Box sx={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 1, 
            bgcolor: 'rgba(28, 28, 45, 0.95)', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="h6" sx={{ px: 2, py: 1.5, fontWeight: 600 }}>
              Notifications
              {unreadCount > 0 && (
                <Badge 
                  badgeContent={unreadCount} 
                  color="error" 
                  sx={{ ml: 1, '& .MuiBadge-badge': { fontSize: '0.7rem' } }}
                />
              )}
            </Typography>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
          </Box>

          {/* Scrollable Content */}
          {isLoading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              p: 4, 
              minHeight: '120px' 
            }}>
              <CircularProgress sx={{ color: '#00FFFF' }} />
            </Box>
          ) : notifications.length > 0 ? (
            <>
              {notifications.map((notification, index) => (
                <MenuItem 
                  key={notification._id} 
                  onClick={() => handleNotificationItemClick(notification)} 
                  sx={{ 
                    fontWeight: notification.read ? 'normal' : 'bold',
                    whiteSpace: 'normal',
                    py: 1.5,
                    px: 2,
                    borderBottom: index < notifications.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    '&:hover': { 
                      backgroundColor: 'rgba(0, 255, 255, 0.1)',
                      transform: 'translateX(2px)',
                      transition: 'all 0.2s ease'
                    },
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: 'white', 
                    minWidth: '40px',
                    mr: 1 
                  }}>
                    {notification.type === 'like' ? 
                      <FaHeart color="#f472b6" size={18} /> : 
                      <FaEnvelope color="#60a5fa" size={18} />
                    }
                  </ListItemIcon>
                  <ListItemText 
                    primary={notification.message}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      lineHeight: 1.4,
                      color: notification.read ? 'rgba(255, 255, 255, 0.8)' : 'white'
                    }}
                    secondary={
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '0.75rem',
                          mt: 0.5,
                          display: 'block'
                        }}
                      >
                        {new Date(notification.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    }
                  />
                  {!notification.read && (
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#00FFFF',
                      ml: 1,
                      flexShrink: 0
                    }} />
                  )}
                </MenuItem>
              ))}
              
              {/* Bottom padding for better scrolling experience */}
              <Box sx={{ height: '8px' }} />
            </>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              minHeight: '120px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              <IoMdNotifications size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
              <Typography variant="body2" align="center">
                No new notifications
              </Typography>
            </Box>
          )}
        </Menu>
      </Box>
    </motion.div>
  );
};

export default Navbar;
