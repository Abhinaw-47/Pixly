import React, { useState, useEffect } from 'react';
import { Box, Grid, useMediaQuery, useTheme, CircularProgress, Paper, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { getProfile } from '../actions/post';
import { fetchUsers } from '../actions/message';
import Background from './Background';
import LeftSidebar from './LeftSidebar'; // Re-using the homepage Left Sidebar
import Posts from './Posts/Posts';
import ProfileHeader from './ProfileHeader';
import SuggestedUsers from './SuggestedUsers';

const SIDEBAR_WIDTH = 280;
const NAVBAR_HEIGHT = '88px';

const Profile = () => {
  const { profile: profileId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  // State & Selectors
  const { posts, isLoading: postsLoading } = useSelector((state) => state.post);
  const { users, isUserLoading } = useSelector((state) => state.message);
  const currentUser = JSON.parse(localStorage.getItem('profile'));
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Scroll to top on profile change
    window.scrollTo(0, 0);
    if (profileId) {
      dispatch(getProfile({ profile: profileId }));
      dispatch(fetchUsers());
    }
  }, [dispatch, profileId,useParams]);

  useEffect(() => {
    if (users.length > 0 && posts) {
      const targetUser = users.find(u => u._id === profileId);
      if (targetUser) {
        const firstName = targetUser.name.split(' ')[0].toLowerCase();
        const userIdSuffix = targetUser._id.slice(-4);
        setProfileData({
          name: targetUser.name,
          username: `${firstName}${userIdSuffix}`,
          postCount: posts.length,
          followers: (users.length - 1) > 0 ? (users.length - 1) : 0,
          following: (users.length - 1) > 0 ? (users.length - 1) : 0,
          joinedDate: targetUser.createdAt || new Date().toISOString(),
        });
      }
    }
  }, [posts, users, profileId,dispatch]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('profile');
    navigate('/');
  };

  if (postsLoading || isUserLoading || !profileData) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Background />
        <CircularProgress sx={{ color: '#00FFFF' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', position: 'relative' }}>
      <Background />
      <Box sx={{ display: 'flex', width: '100%', position: 'relative', zIndex: 1, pt: NAVBAR_HEIGHT }}>
        
        {/* Left Sidebar (Same as Homepage) */}
        {isDesktop && (
          <Box sx={{ width: SIDEBAR_WIDTH, position: 'fixed', top: NAVBAR_HEIGHT, left: 0, height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
            <LeftSidebar user={currentUser} onLogout={handleLogout} onShowForm={() => navigate('/')} />
          </Box>
        )}

        {/* Main Profile Content */}
        <Box sx={{ flexGrow: 1, ml: isDesktop ? `${SIDEBAR_WIDTH}px` : 0, mr: isDesktop ? `${SIDEBAR_WIDTH}px` : 0, height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
          <Box sx={{ height: '100%', overflowY: 'auto', p: { xs: 1, sm: 2, md: 3 }, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(0, 255, 255, 0.3)', borderRadius: '10px' } }}>
            <ProfileHeader profileData={profileData} />
            
            <Paper elevation={0} sx={{ p: {xs: 1, sm: 2, md: 3}, borderRadius: '24px', background: 'rgba(28, 28, 45, 0.7)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="h5" fontWeight={600} color="white" sx={{ mb: 2, px: 1 }}>Posts</Typography>
              <Posts setCurrentId={() => {}} setShowForm={() => {}} />
            </Paper>

          </Box>
        </Box>

        {/* Right Sidebar (Suggested Users) */}
        {isDesktop && (
          <Box sx={{ width: SIDEBAR_WIDTH, position: 'fixed', top: NAVBAR_HEIGHT, right: 0, height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
            <SuggestedUsers />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Profile;