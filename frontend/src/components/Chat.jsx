import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, CircularProgress, Avatar, List, ListItemButton,
  ListItemText, ListItemAvatar, Divider, Paper, useMediaQuery, 
  Badge, InputBase, IconButton, Fade, Slide, Zoom
} from '@mui/material';
import { FaUserCircle, FaComments, FaSearch, FaUsers, FaRocket } from 'react-icons/fa';
import { MdOnlinePrediction } from 'react-icons/md';
import { keyframes } from '@mui/system';
import ChatContainer from './ChatContainer';
import { connectSocket } from '../api';
import { fetchUsers } from '../actions/message';

const pulseOnline = keyframes`
  0%, 100% { 
    transform: scale(1); 
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  50% { 
    transform: scale(1.1); 
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
  }
`;

const floatUser = keyframes`
  0%, 100% { transform: translateY(0px) rotateY(0deg); }
  25% { transform: translateY(-2px) rotateY(1deg); }
  50% { transform: translateY(-1px) rotateY(-1deg); }
  75% { transform: translateY(-3px) rotateY(0.5deg); }
`;

const shimmerBackground = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const bounceIn = keyframes`
  0% { 
    transform: scale(0.3) rotateY(-90deg); 
    opacity: 0; 
  }
  50% { 
    transform: scale(1.05) rotateY(0deg); 
    opacity: 1; 
  }
  70% { 
    transform: scale(0.9) rotateY(0deg); 
  }
  100% { 
    transform: scale(1) rotateY(0deg); 
    opacity: 1; 
  }
`;

const Chat = () => {
  const dispatch = useDispatch();
  const { users, isUserLoading, selectedUser } = useSelector((state) => state.message);
  const { onlineUsers } = useSelector((state) => state.auth);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setMounted(true);
    
    // Initialize socket connection
    const socketConnection = connectSocket();
    
    if (!socketConnection) {
      console.error('Failed to establish socket connection');
      return;
    }
    
    setSocket(socketConnection);

    // Set up socket listeners with proper cleanup
    const handleOnlineUsers = (UserIds) => {
      console.log('Online users received:', UserIds);
      dispatch({ type: 'SET_ONLINE_USERS', payload: UserIds || [] });
    };

    const handleUserConnected = (userId) => {
      console.log('User connected:', userId);
      dispatch({ type: 'ADD_ONLINE_USER', payload: userId });
    };

    const handleUserDisconnected = (userId) => {
      console.log('User disconnected:', userId);
      dispatch({ type: 'REMOVE_ONLINE_USER', payload: userId });
    };

    // Add listeners
    socketConnection.on('getOnlineUsers', handleOnlineUsers);
    socketConnection.on('userConnected', handleUserConnected);
    socketConnection.on('userDisconnected', handleUserDisconnected);

    // Fetch users and then request online users
    const initializeData = async () => {
      try {
        await dispatch(fetchUsers());
        
        // Wait for socket to be properly connected
        if (socketConnection.connected) {
          socketConnection.emit('getOnlineUsers');
        } else {
          socketConnection.on('connect', () => {
            console.log('Socket connected, requesting online users');
            socketConnection.emit('getOnlineUsers');
          });
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    initializeData();

    // Cleanup function
    return () => {
      if (socketConnection) {
        socketConnection.off('getOnlineUsers', handleOnlineUsers);
        socketConnection.off('userConnected', handleUserConnected);
        socketConnection.off('userDisconnected', handleUserDisconnected);
        // Don't disconnect here as other components might be using it
      }
    };
  }, [dispatch]);

  // Additional useEffect to handle online users when users list changes
  useEffect(() => {
    if (socket && socket.connected && users?.length > 0) {
      // Request online users when we have the users list
      console.log('Requesting online users after users loaded');
      socket.emit('getOnlineUsers');
    }
  }, [users, socket]);

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const onlineUsersCount = users?.filter(user => onlineUsers.includes(user._id)).length || 0;

  if (isUserLoading) {
    return (
      <Fade in={isUserLoading} timeout={800}>
        <Box 
          minHeight="100vh" 
          display="flex" 
          flexDirection="column"
          alignItems="center" 
          justifyContent="center"
          sx={{ 
            background: `
              radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
              linear-gradient(135deg, #000000 0%, #1a0033 25%, #2a003f 50%, #1a0033 75%, #000000 100%)
            `,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: '30px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: `
                  linear-gradient(
                    90deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.1), 
                    transparent
                  )
                `,
                animation: `${shimmerBackground} 2s ease-in-out infinite`,
              },
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
              <CircularProgress 
                size={60}
                thickness={3}
                sx={{ 
                  color: '#8b5cf6',
                  animation: `${floatUser} 3s ease-in-out infinite`,
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaComments size={24} color="#8b5cf6" />
              </Box>
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'white',
                fontWeight: 700,
                mb: 1,
                background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Loading Conversations...
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Connecting you with your friends
            </Typography>
          </Paper>
        </Box>
      </Fade>
    );
  }

  if (!users?.length) {
    return (
      <Fade in={!users?.length} timeout={800}>
        <Box 
          minHeight="100vh" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          sx={{ 
            background: `
              radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
              linear-gradient(135deg, #000000 0%, #1a0033 25%, #2a003f 50%, #1a0033 75%, #000000 100%)
            `,
          }}
        >
          <Paper 
            elevation={0} 
            sx={{
              p: 6, 
              borderRadius: '30px', 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              maxWidth: 400,
            }}
          >
            <Zoom in timeout={1000} style={{ transitionDelay: '300ms' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                  animation: `${floatUser} 4s ease-in-out infinite`,
                }}
              >
                <FaUserCircle size={40} />
              </Avatar>
            </Zoom>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'white',
                fontWeight: 700,
                mb: 2,
              }}
            >
              No Friends Yet
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.6,
              }}
            >
              Start connecting with people to begin chatting
            </Typography>
          </Paper>
        </Box>
      </Fade>
    );
  }

  const showUserList = isSmallScreen ? !selectedUser : true;
  const showChat = isSmallScreen ? selectedUser : true;

  return (
    <Fade in={mounted} timeout={1000}>
      <Box 
        display="flex" 
        minHeight="100vh" 
        sx={{ 
          background: `
            radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, #000000 0%, #1a0033 25%, #2a003f 50%, #1a0033 75%, #000000 100%)
          `,
          color: 'white',
        }}
      >
        {showUserList && (
          <Slide direction="right" in={showUserList} timeout={800}>
            <Box
              width={{ xs: '100%', sm: '400px', md: '350px' }}
              sx={{
                borderRight: { sm: '1px solid rgba(255,255,255,0.15)' },
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
              }}
            >
              <Zoom in={mounted} timeout={800} style={{ transitionDelay: '200ms' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 0,
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                        width: 50,
                        height: 50,
                        animation: `${floatUser} 5s ease-in-out infinite`,
                      }}
                    >
                      <FaComments size={24} />
                    </Avatar>
                    <Box flex={1}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: 'white',
                          background: 'linear-gradient(45deg, #ffffff, #e0e0ff)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        Messages
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)">
                          {users.length} contacts
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: '#22c55e',
                              animation: `${pulseOnline} 2s infinite`,
                            }}
                          />
                          <Typography variant="caption" color="#22c55e">
                            {onlineUsersCount} online
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Paper
                    elevation={0}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                      borderRadius: '20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:focus-within': {
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(139, 92, 246, 0.5)',
                        boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.2)',
                      },
                    }}
                  >
                    <FaSearch size={16} color="rgba(255,255,255,0.6)" />
                    <InputBase
                      sx={{
                        ml: 1,
                        flex: 1,
                        color: 'white',
                        '&::placeholder': { color: 'rgba(255,255,255,0.5)' },
                      }}
                      placeholder="Search friends..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Paper>
                </Paper>
              </Zoom>

              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <List sx={{ py: 1, height: '100%', overflow: 'auto' }}>
                  {filteredUsers.map((user, index) => (
                    <Slide 
                      key={user._id} 
                      direction="right" 
                      in={mounted} 
                      timeout={600} 
                      style={{ transitionDelay: `${400 + index * 100}ms` }}
                    >
                      <ListItemButton
                        onClick={() => dispatch({ type: 'SELECT_USER', payload: user })}
                        sx={{
                          borderRadius: '15px',
                          mx: 2,
                          mb: 1,
                          p: 2,
                          background: selectedUser?._id === user._id
                            ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                            : 'transparent',
                          border: selectedUser?._id === user._id 
                            ? '1px solid rgba(255, 255, 255, 0.3)'
                            : '1px solid transparent',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          animation: selectedUser?._id === user._id 
                            ? `${bounceIn} 0.6s ease-out`
                            : 'none',
                          '&:hover': {
                            background: selectedUser?._id === user._id
                              ? 'linear-gradient(135deg, #2563eb, #7c3aed)'
                              : 'rgba(255,255,255,0.08)',
                            transform: 'translateX(5px)',
                            boxShadow: '0 5px 20px rgba(139, 92, 246, 0.3)',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Box position="relative">
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    bgcolor: onlineUsers.includes(user._id) ? '#22c55e' : '#6b7280',
                                    border: '3px solid rgba(0,0,0,0.8)',
                                    animation: onlineUsers.includes(user._id) 
                                      ? `${pulseOnline} 2s infinite` 
                                      : 'none',
                                  }}
                                />
                              }
                            >
                              <Avatar 
                                sx={{ 
                                  width: 50,
                                  height: 50,
                                  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                                  border: '2px solid rgba(255, 255, 255, 0.2)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              >
                                <FaUserCircle size={24} />
                              </Avatar>
                            </Badge>
                          </Box>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography 
                              sx={{ 
                                color: 'white',
                                fontWeight: selectedUser?._id === user._id ? 700 : 500,
                                fontSize: '1rem',
                              }} 
                              noWrap
                            >
                              {user.name}
                            </Typography>
                          }
                          secondary={
                            <Typography 
                              variant="caption" 
                              sx={{
                                color: onlineUsers.includes(user._id) 
                                  ? '#22c55e' 
                                  : 'rgba(255,255,255,0.6)',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              {onlineUsers.includes(user._id) && (
                                <MdOnlinePrediction size={12} />
                              )}
                              {onlineUsers.includes(user._id) ? 'Active now' : 'Offline'}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </Slide>
                  ))}
                </List>
              </Box>

              <Fade in={mounted} timeout={800} style={{ transitionDelay: '600ms' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 0,
                  }}
                >
                  <Box display="flex" justifyContent="space-around" alignItems="center">
                    <Box textAlign="center">
                      <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                        {users.length}
                      </Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        Friends
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 700 }}>
                        {onlineUsersCount}
                      </Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        Online
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Fade>
            </Box>
          </Slide>
        )}

        {showChat && (
          <Fade in={showChat} timeout={800} style={{ transitionDelay: '400ms' }}>
            <Box flex={1} sx={{ display: 'flex', flexDirection: 'column' }}>
              <ChatContainer />
            </Box>
          </Fade>
        )}
      </Box>
    </Fade>
  );
};

export default Chat;