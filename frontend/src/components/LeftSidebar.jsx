import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Avatar, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { FaUser, FaPen, FaCommentDots, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProfile } from '../actions/post';

// ✨ FIX: The component no longer accepts a `user` prop.
const LeftSidebar = ({ onLogout, onShowForm }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  // ✨ FIX: The component now manages its own user state from localStorage.
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  // ✨ FIX: This useEffect ensures the user data is fresh on every navigation change.
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);


  const handleProfileClick = () => {
    // This now correctly uses the logged-in user's ID from its own state.
     dispatch(getProfile({ profile: user?.result?._id }));
    if (user?.result?._id) navigate(`/posts/profile/${user.result._id}`);
  };

  const LoggedOutState = () => (
    <Paper elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: '16px', background: 'rgba(28, 28, 45, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }}><FaSignInAlt /></Avatar>
      <Typography variant="h6" fontWeight={600} sx={{ color: 'white', mb: 1 }}>Join the Conversation</Typography>
      <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" sx={{ mb: 2 }}>
        Sign in to create posts, chat with friends, and more.
      </Typography>
      <Button variant="contained" fullWidth onClick={() => navigate('/auth')} sx={{ background: 'linear-gradient(45deg, #00FFFF, #2E73E8)', color: '#000', fontWeight: 'bold' }}>
        Sign In
      </Button>
    </Paper>
  );

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', p: 2, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(0, 255, 255, 0.2)', borderRadius: '10px' } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {user ? (
          <>
            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: '16px', background: 'rgba(28, 28, 45, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Avatar sx={{ width: 70, height: 70, mx: 'auto', mb: 2, background: 'linear-gradient(135deg, #00FFFF, #2E73E8)', fontSize: '2rem', fontWeight: 700, border: '2px solid #00FFFF' }}>
                {user.result.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" fontWeight={600} noWrap sx={{ color: 'white' }}>{user.result.name}</Typography>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" sx={{ mb: 2 }}>Welcome back! 👋</Typography>
              <Button variant="outlined" fullWidth onClick={handleProfileClick} sx={{ borderColor: '#00FFFF', color: '#00FFFF', borderRadius: '8px', textTransform: 'none', '&:hover': { backgroundColor: 'rgba(0, 255, 255, 0.1)', borderColor: '#00FFFF' }}}>
                View My Profile
              </Button>
            </Paper>
            <Paper elevation={0} sx={{ p: 1, borderRadius: '16px', background: 'rgba(28, 28, 45, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
              <List sx={{ color: 'white' }}>
                <ListItem disablePadding><ListItemButton sx={{ borderRadius: '8px' }} onClick={onShowForm}><ListItemIcon sx={{ color: '#00FFFF' }}><FaPen /></ListItemIcon><ListItemText primary="Create Post" /></ListItemButton></ListItem>
                <ListItem disablePadding><ListItemButton sx={{ borderRadius: '8px' }} onClick={() => navigate('/chat')}><ListItemIcon sx={{ color: '#2E73E8' }}><FaCommentDots /></ListItemIcon><ListItemText primary="Messages" /></ListItemButton></ListItem>
                <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <ListItem disablePadding><ListItemButton sx={{ borderRadius: '8px', '&:hover': { backgroundColor: 'rgba(248, 113, 113, 0.1)'} }} onClick={onLogout}><ListItemIcon sx={{ color: '#F87171' }}><FaSignOutAlt /></ListItemIcon><ListItemText primaryTypographyProps={{color: '#F87171'}}>Sign Out</ListItemText></ListItemButton></ListItem>
              </List>
            </Paper>
          </>
        ) : (
          <LoggedOutState />
        )}
      </Box>
    </Box>
  );
};

export default LeftSidebar;