import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, CircularProgress, Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getLikedPosts } from '../actions/post';
import { fetchUsers } from '../actions/message';
import Post from './Posts/post/Post';
import PostSkeleton from './Posts/post/PostSkeleton';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Background from './Background';

const SIDEBAR_WIDTH = 280;
const NAVBAR_HEIGHT = '88px';

const LoadingState = () => (
  <Box sx={{ 
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 3,
    '@media (max-width: 900px)': { 
      gridTemplateColumns: '1fr'
    }
  }}>
    {[...Array(4)].map((_, index) => (
      <PostSkeleton key={index} />
    ))}
  </Box>
);

const EmptyState = ({ onExploreClick }) => (
  <Container maxWidth="sm">
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      textAlign: 'center', 
      minHeight: '60vh', 
      justifyContent: 'center', 
      color: 'rgba(255, 255, 255, 0.5)' 
    }}>
      <FaHeart size={60} color="rgba(248, 113, 113, 0.5)" />
      <Typography variant="h5" fontWeight={700} sx={{ mt: 3, color: 'rgba(255, 255, 255, 0.8)' }}>
        No liked posts yet
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
        Start exploring and liking posts. They'll appear here.
      </Typography>
      <Button 
        variant="contained" 
        onClick={onExploreClick}
        sx={{ 
          bgcolor: '#00FFFF', 
          color: '#000',
          '&:hover': { bgcolor: '#00CCCC' },
          fontWeight: 600
        }}
      >
        Explore Posts
      </Button>
    </Box>
  </Container>
);

const LikedPosts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const { likedPosts, isLoading } = useSelector((state) => state.post);
  const { users } = useSelector((state) => state.message);
  const { onlineUsers } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getLikedPosts());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('profile');
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', position: 'relative' }}>
      <Background />
      <Box sx={{ display: 'flex', width: '100%', position: 'relative', zIndex: 1, pt: NAVBAR_HEIGHT }}>
        
        {isDesktop && (
          <Box sx={{ width: SIDEBAR_WIDTH, position: 'fixed', top: NAVBAR_HEIGHT, left: 0, height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
            <LeftSidebar onLogout={handleLogout} onShowForm={() => navigate('/')} />
          </Box>
        )}

        <Box sx={{ flexGrow: 1, ml: isDesktop ? `${SIDEBAR_WIDTH}px` : 0, mr: isDesktop ? `${SIDEBAR_WIDTH}px` : 0, height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
          <Box sx={{ height: '100%', overflowY: 'auto', p: { xs: 1, sm: 2, md: 3 } }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Paper
                elevation={0}
                sx={{
                    p: {xs: 2, md: 3},
                    borderRadius: '24px',
                    background: 'rgba(28, 28, 45, 0.7)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    mb: 4,
                }}
              >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <FaHeart size={32} color="#F87171" />
                      <Box>
                          <Typography variant="h4" fontWeight={700} color="white">Liked Posts</Typography>
                          <Typography color="rgba(255, 255, 255, 0.7)">
                              {likedPosts ? `${likedPosts.length} posts you've liked` : 'Loading...'}
                          </Typography>
                      </Box>
                  </Box>
              </Paper>
            </motion.div>

            {isLoading && <LoadingState />}

            {!isLoading && (!likedPosts || likedPosts.length === 0) && (
              <EmptyState onExploreClick={() => navigate('/')} />
            )}

            {!isLoading && likedPosts && likedPosts.length > 0 && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                   
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 3,
                      '@media (max-width: 900px)': { // md breakpoint
                        gridTemplateColumns: '1fr'
                      }
                    }}>
                      {likedPosts.map((post) => (
                        <motion.div 
                          key={post._id}
                          variants={itemVariants}
                        >
                          <Post 
                            post={post} 
                            setCurrentId={() => {}} 
                            setShowForm={() => {}}
                          />
                        </motion.div>
                      ))}
                    </Box>
                </motion.div>
            )}
          </Box>
        </Box>

        {isDesktop && (
          <Box sx={{ width: SIDEBAR_WIDTH, position: 'fixed', top: NAVBAR_HEIGHT, right: 0, height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
            <RightSidebar allUsers={users} onlineUsers={onlineUsers} recentMessages={[]} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LikedPosts;