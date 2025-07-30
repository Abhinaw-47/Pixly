import React, { useEffect } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Badge, ListItemButton, Grid, Link as MuiLink } from '@mui/material';
import { FaUsers, FaCommentDots, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket, addSocketListener, emitSocketEvent, getSocket } from '../api';

const RightSidebar = ({ allUsers = [], recentMessages = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  

  const { onlineUsers } = useSelector((state) => state.auth);
  
 
  const onlineUsersArray = Array.isArray(onlineUsers) ? onlineUsers : [];

  useEffect(() => {
    // Connect socket if user is logged in
    if (user?.result?._id) {
      const socket = connectSocket();
      
      if (socket) {
        // Listen for online users updates
        addSocketListener('getOnlineUsers', (onlineUsersList) => {
          console.log('RightSidebar: Online users updated:', onlineUsersList);
          dispatch({
            type: 'SET_ONLINE_USERS', // Use SET_ONLINE_USERS to match reducer
            payload: onlineUsersList
          });
        });

        // Listen for user connected events
        addSocketListener('userConnected', (userId) => {
          console.log('RightSidebar: User connected:', userId);
          dispatch({
            type: 'USER_ONLINE',
            payload: userId
          });
        });

        // Listen for user disconnected events
        addSocketListener('userDisconnected', (userId) => {
          console.log('RightSidebar: User disconnected:', userId);
          dispatch({
            type: 'USER_OFFLINE',
            payload: userId
          });
        });

        // Request current online users if socket is connected
        if (socket.connected) {
          setTimeout(() => {
            emitSocketEvent('getOnlineUsers');
          }, 500);
        } else {
          // Wait for connection and then request online users
          const waitForConnection = () => {
            if (socket.connected) {
              emitSocketEvent('getOnlineUsers');
            } else {
              setTimeout(waitForConnection, 500);
            }
          };
          waitForConnection();
        }
      }
    }

    // Cleanup function
    return () => {
      const socket = getSocket();
      if (socket) {
        // Only remove listeners that were added by this component
        // Don't remove all listeners as Chat component might be using them
        socket.off('getOnlineUsers');
        socket.off('userConnected');
        socket.off('userDisconnected');
      }
    };
  }, [user?.result?._id, dispatch]);

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

  // Filter out current user from the list
  const usersToDisplay = allUsers.filter(u => u._id !== user?.result?._id);

  // Separate online and offline users for better UX (excluding current user from online count)
  const onlineUsersList = usersToDisplay.filter(u => onlineUsersArray.includes(u._id));
  const offlineUsersList = usersToDisplay.filter(u => !onlineUsersArray.includes(u._id));
  const sortedUsers = [...onlineUsersList, ...offlineUsersList]; // Show online users first

  // Count of other online users (excluding current user)
  const otherOnlineUsersCount = onlineUsersList.length;

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', p: 2, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(0, 255, 255, 0.2)', borderRadius: '10px' } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {user ? (
          <>
            {/* FRIENDS SECTION WITH VERTICAL SCROLL */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: '24px', background: 'rgba(28, 28, 45, 0.7)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <FaUsers color="#00FFFF" />
                <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>
                  Friends
                  {otherOnlineUsersCount > 0 && (
                    <Typography component="span" variant="caption" sx={{ color: '#44b700', ml: 1 }}>
                      ({otherOnlineUsersCount} online)
                    </Typography>
                  )}
                </Typography>
              </Box>

              <Box sx={{
                maxHeight: '300px', // Set a max height for the container
                overflowY: 'auto',  // Enable vertical scroll on overflow
                pr: 1, // Padding to avoid scrollbar overlapping content
                // Custom scrollbar styling
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { 
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '10px'
                },
                '&::-webkit-scrollbar-thumb': { 
                  background: 'linear-gradient(180deg, #00FFFF, #2E73E8)', 
                  borderRadius: '10px',
                  '&:hover': {
                    background: 'linear-gradient(180deg, #00E0E0, #1F63D8)'
                  }
                }
              }}>
                {sortedUsers.length > 0 ? (
                  <Grid container spacing={1.5}>
                    {sortedUsers.map((u) => {
                      const isUserOnline = onlineUsersArray.includes(u._id);
                      
                      return (
                        <Grid item xs={6} key={u._id}>
                          <Box
                            onClick={() => handleUserClick(u)}
                            sx={{
                              textAlign: 'center',
                              p: 1.5,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': { 
                                transform: 'translateY(-2px)',
                                '& .user-avatar': {
                                  transform: 'scale(1.1)',
                                  boxShadow: isUserOnline 
                                    ? '0 8px 25px rgba(68, 183, 0, 0.4)'
                                    : '0 8px 25px rgba(0, 255, 255, 0.3)'
                                }
                              }
                            }}
                          >
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              variant="dot"
                              invisible={!isUserOnline}
                              sx={{
                                '& .MuiBadge-dot': {
                                  backgroundColor: '#44b700',
                                  boxShadow: '0 0 0 3px #1C1C2D, 0 0 12px rgba(68, 183, 0, 0.8)',
                                  width: 16,
                                  height: 16,
                                  borderRadius: '50%',
                                  animation: isUserOnline ? 'pulse 2s infinite' : 'none',
                                },
                                '@keyframes pulse': {
                                  '0%': {
                                    transform: 'scale(1)',
                                    opacity: 1,
                                  },
                                  '50%': {
                                    transform: 'scale(1.2)',
                                    opacity: 0.7,
                                  },
                                  '100%': {
                                    transform: 'scale(1)',
                                    opacity: 1,
                                  },
                                }
                              }}
                            >
                              <Avatar 
                                className="user-avatar"
                                sx={{ 
                                  width: 64, 
                                  height: 64, 
                                  mx: 'auto', 
                                  mb: 1, 
                                  background: isUserOnline 
                                    ? 'linear-gradient(135deg, #44b700, #32a300)' 
                                    : 'linear-gradient(135deg, #00FFFF, #2E73E8)',
                                  border: isUserOnline 
                                    ? '4px solid rgba(68, 183, 0, 0.3)' 
                                    : '3px solid rgba(255, 255, 255, 0.1)',
                                  fontSize: '1.4rem',
                                  fontWeight: 700,
                                  boxShadow: isUserOnline 
                                    ? '0 4px 20px rgba(68, 183, 0, 0.3)'
                                    : '0 4px 15px rgba(0, 255, 255, 0.2)',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                {u.name.charAt(0).toUpperCase()}
                              </Avatar>
                            </Badge>
                            <Typography 
                              noWrap 
                              color="white" 
                              fontWeight={isUserOnline ? 700 : 500}
                              sx={{ 
                                fontSize: '0.9rem',
                                opacity: isUserOnline ? 1 : 0.8,
                                mb: 0.3
                              }}
                            >
                              {u.name}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: isUserOnline ? '#44b700' : 'rgba(255,255,255,0.5)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5
                              }}
                            >
                              {isUserOnline && (
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    backgroundColor: '#44b700',
                                    boxShadow: '0 0 6px rgba(68, 183, 0, 1)',
                                  }}
                                />
                              )}
                              {isUserOnline ? 'Online' : 'Offline'}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="rgba(255,255,255,0.6)" textAlign="center" sx={{p: 2}}>
                    No other users yet.
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* RECENT CHATS SECTION WITH SCROLLING */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', background: 'rgba(28, 28, 45, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <FaCommentDots color="#2E73E8" />
                <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>Recent Chats</Typography>
              </Box>
              
              <Box sx={{
                maxHeight: '250px', // Set max height for scrollable area
                overflowY: 'auto',  // Enable vertical scroll
                pr: 1, // Padding to avoid scrollbar overlapping content
                // Custom scrollbar styling
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { 
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '10px'
                },
                '&::-webkit-scrollbar-thumb': { 
                  background: 'linear-gradient(180deg, #2E73E8, #1F63D8)', 
                  borderRadius: '10px',
                  '&:hover': {
                    background: 'linear-gradient(180deg, #4285F4, #2E73E8)'
                  }
                }
              }}>
                <List disablePadding>
                  {recentMessages.length > 0 ? recentMessages.map((msg, index) => {
                    const isMessageUserOnline = onlineUsersArray.includes(msg.userId);
                    
                    return (
                      <ListItemButton 
                        key={msg.userId || index} 
                        sx={{ 
                          p: 1.5, 
                          borderRadius: '12px',
                          mb: 1,
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            transform: 'translateX(4px)',
                            '& .message-avatar': {
                              transform: 'scale(1.1)',
                              boxShadow: isMessageUserOnline 
                                ? '0 4px 15px rgba(68, 183, 0, 0.4)'
                                : '0 4px 15px rgba(0, 255, 255, 0.3)'
                            }
                          }
                        }} 
                        onClick={() => handleUserClick(allUsers.find(u => u._id === msg.userId))}
                      >
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            invisible={!isMessageUserOnline}
                            sx={{
                              '& .MuiBadge-dot': {
                                backgroundColor: '#44b700',
                                boxShadow: '0 0 0 2px #1C1C2D, 0 0 8px rgba(68, 183, 0, 0.8)',
                                width: 12,
                                height: 12,
                              },
                            }}
                          >
                            <Avatar 
                              className="message-avatar"
                              sx={{ 
                                background: isMessageUserOnline
                                  ? 'linear-gradient(135deg, #44b700, #32a300)'
                                  : `hsl(${index * 60 + 180}, 70%, 50%)`, 
                                width: 48, 
                                height: 48,
                                border: isMessageUserOnline 
                                  ? '3px solid rgba(68, 183, 0, 0.3)' 
                                  : '2px solid rgba(255, 255, 255, 0.1)',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                boxShadow: isMessageUserOnline 
                                  ? '0 2px 10px rgba(68, 183, 0, 0.3)'
                                  : '0 2px 8px rgba(0, 0, 0, 0.2)',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              {msg.user.charAt(0).toUpperCase()}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={msg.user} 
                          secondary={msg.message} 
                          primaryTypographyProps={{ 
                            fontWeight: isMessageUserOnline ? 600 : 500, 
                            noWrap: true, 
                            color: 'white' 
                          }} 
                          secondaryTypographyProps={{ 
                            noWrap: true, 
                            color: 'rgba(255,255,255,0.6)' 
                          }}
                        />
                      </ListItemButton>
                    );
                  }) : (
                    <Typography variant="body2" color="rgba(255,255,255,0.6)" textAlign="center" sx={{p: 2}}>
                      No recent chats.
                    </Typography>
                  )}
                </List>
              </Box>
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