import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Badge, ListItemButton, Grid, Link as MuiLink } from '@mui/material';
import { FaUsers, FaCommentDots, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const RightSidebar = ({ onlineUsers = [], allUsers = [], recentMessages = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));

  const handleUserClick = (clickedUser) => {
    if (!clickedUser) return;
    dispatch({ type: 'SELECT_USER', payload: clickedUser });
    navigate('/chat');
  };

  const LoggedOutState = () => (
    <Paper elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: '16px', background: 'rgba(28, 28, 45, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <FaGlobe size={30} style={{ marginBottom: '1rem', color: '#00FFFF' }} />
        <Typography variant="body1" fontWeight={500} sx={{ color: 'white' }}>
            Sign in to see who's online and view your messages.
        </Typography>
    </Paper>
  );

  const usersToDisplay = allUsers.filter(u => u._id !== user?.result?._id);

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', p: 2, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(0, 255, 255, 0.2)', borderRadius: '10px' } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {user ? (
          <>
            {/* ✨ FRIENDS SECTION WITH VERTICAL SCROLL */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: '24px', background: 'rgba(28, 28, 45, 0.7)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <FaUsers color="#00FFFF" />
                <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>Friends</Typography>
              </Box>

              <Box sx={{
                maxHeight: '350px', // Set a max height for the container
                overflowY: 'auto',  // Enable vertical scroll on overflow
                pr: 1, // Padding to avoid scrollbar overlapping content
                // Custom scrollbar for this specific box
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.05)' },
                '&::-webkit-scrollbar-thumb': { background: 'rgba(0, 255, 255, 0.3)', borderRadius: '10px' }
              }}>
                {usersToDisplay.length > 0 ? (
                  <Grid container spacing={2}>
                    {usersToDisplay.map((u) => (
                      <Grid item xs={6} key={u._id}>
                        <Box
                          onClick={() => handleUserClick(u)}
                          sx={{
                            textAlign: 'center',
                            p: 1,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                          }}
                        >
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            invisible={!onlineUsers.includes(u._id)}
                            sx={{
                              '& .MuiBadge-dot': {
                                backgroundColor: '#44b700',
                                boxShadow: '0 0 0 2px #1C1C2D', // Theme background color for contrast
                              },
                            }}
                          >
                            <Avatar sx={{ width: 70, height: 70, mx: 'auto', mb: 1, background: 'linear-gradient(45deg, #00FFFF, #2E73E8)' }}>
                              {u.name.charAt(0).toUpperCase()}
                            </Avatar>
                          </Badge>
                          <Typography noWrap color="white" fontWeight={500}>{u.name}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="rgba(255,255,255,0.6)" textAlign="center" sx={{p: 2}}>
                    No other users yet.
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* RECENT CHATS SECTION (UNCHANGED) */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', background: 'rgba(28, 28, 45, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <FaCommentDots color="#2E73E8" />
                <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>Recent Chats</Typography>
              </Box>
              <List disablePadding>
                {recentMessages.length > 0 ? recentMessages.map((msg, index) => (
                  <ListItemButton key={msg.userId || index} sx={{ p: 1, borderRadius: '8px' }} onClick={() => handleUserClick(allUsers.find(u => u._id === msg.userId))}>
                    <ListItemAvatar><Avatar sx={{ background: `hsl(${index * 60 + 180}, 70%, 50%)`, width: 40, height: 40 }}>{msg.user.charAt(0).toUpperCase()}</Avatar></ListItemAvatar>
                    <ListItemText primary={msg.user} secondary={msg.message} primaryTypographyProps={{ fontWeight: 500, noWrap: true, color: 'white' }} secondaryTypographyProps={{ noWrap: true, color: 'rgba(255,255,255,0.6)' }}/>
                  </ListItemButton>
                )) : (
                  <Typography variant="body2" color="rgba(255,255,255,0.6)" textAlign="center" sx={{p: 2}}>No recent chats.</Typography>
                )}
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

export default RightSidebar;