import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages } from '../actions/message';
import ChatInput from './ChatInput';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  useMediaQuery,
  IconButton,
  Fade,
  Slide,
  Zoom,
  Badge,
} from '@mui/material';
import { FaUserCircle, FaPaperPlane, FaTimes, FaArrowLeft, FaCheckDouble, FaCheck } from 'react-icons/fa';
import { MdOnlinePrediction, MdVideoCall, MdCall, MdMoreVert } from 'react-icons/md';
import { keyframes } from '@mui/system';
import { connectSocket, getSocket } from '../api';


const messageSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const typingIndicator = keyframes`
  0%, 60%, 100% { transform: scale(1); opacity: 0.7; }
  30% { transform: scale(1.2); opacity: 1; }
`;

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

const floatMessage = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
`;

const shimmerLoad = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const ChatContainer = () => {
  const dispatch = useDispatch();
  const { isMsgLoading, selectedUser, messages } = useSelector((s) => s.message);
  const { onlineUsers } = useSelector((state) => state.auth);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const subscribe = useCallback(() => {
    if (!selectedUser) return;
    const socket = connectSocket();
    socket.off('receiveMessage');
    socket.on('receiveMessage', (msg) =>
      dispatch({ type: 'SEND_MESSAGE', payload: msg })
    );
  }, [selectedUser, dispatch]);

  const unsubscribe = useCallback(() => {
    const socket = getSocket();
    if (socket) socket.off('receiveMessage');
  }, []);

  useEffect(() => {
    if (selectedUser) {
      dispatch(getMessages(selectedUser._id));
      subscribe();
    }
    return unsubscribe;
  }, [selectedUser, dispatch, subscribe, unsubscribe]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fmtTime = (t) =>
    new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const fmtDate = (t) => {
    const d = new Date(t),
      td = new Date(),
      yd = new Date(td.setDate(td.getDate() - 1));
    if (d.toDateString() === new Date().toDateString()) return 'Today';
    if (d.toDateString() === yd.toDateString()) return 'Yesterday';
    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const withSeps = (messages || []).reduce((acc, m, i, arr) => {
    const prev = arr[i - 1];
    if (!i || new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString()) {
      acc.push({ type: 'sep', date: m.createdAt, id: `sep-${i}` });
    }
    acc.push({ ...m, type: 'msg', id: m._id });
    return acc;
  }, []);

  if (!selectedUser) {
    return (
      <Fade in timeout={800}>
        <Box 
          flex={1} 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          sx={{ 
            background: `
              radial-gradient(circle at center, rgba(139, 92, 246, 0.1), transparent 70%),
              linear-gradient(135deg, rgba(0,0,0,0.8), rgba(42, 0, 63, 0.6))
            `,
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
        
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            {[...Array(20)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  background: `rgba(139, 92, 246, ${0.3 + Math.random() * 0.4})`,
                  borderRadius: '50%',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `${floatMessage} ${3 + i * 0.2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </Box>

          <Paper 
            elevation={0} 
            sx={{
              p: 6, 
              textAlign: 'center', 
              borderRadius: '30px',
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              maxWidth: 400,
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
                animation: `${shimmerLoad} 3s ease-in-out infinite`,
              },
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
                  animation: `${floatMessage} 4s ease-in-out infinite`,
                }}
              >
                <FaPaperPlane size={32} />
              </Avatar>
            </Zoom>
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'white',
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(45deg, #ffffff, #e0e0ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Start Chatting
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.6,
              }}
            >
              Select a friend from the sidebar to begin your conversation
            </Typography>
          </Paper>
        </Box>
      </Fade>
    );
  }

  if (isMsgLoading) {
    return (
      <Fade in={isMsgLoading} timeout={500}>
        <Box 
          flex={1} 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          sx={{ 
            background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(42, 0, 63, 0.6))',
            height: '100vh',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
              <CircularProgress 
                size={50}
                thickness={3}
                sx={{ color: '#8b5cf6' }}
              />
            </Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Loading Messages...
            </Typography>
          </Paper>
        </Box>
      </Fade>
    );
  }

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      sx={{
        background: `
          radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.1), transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.1), transparent 50%),
          linear-gradient(135deg, rgba(0,0,0,0.9), rgba(42, 0, 63, 0.8))
        `,
        color: 'white',
      }}
    >
    
    
      <Slide direction="down" in timeout={600}>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 0,
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
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
                  rgba(255, 255, 255, 0.05), 
                  transparent
                )
              `,
              animation: `${shimmerLoad} 4s ease-in-out infinite`,
            },
          }}
        >
          <Box display="flex" alignItems="center">
          
            {isSmallScreen && (
              <IconButton
                onClick={() => dispatch({ type: 'SELECT_USER', payload: null })}
                sx={{
                  mr: 2,
                  color: 'rgba(255, 255, 255, 0.8)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <FaArrowLeft size={18} />
              </IconButton>
            )}

            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: isOnline ? '#22c55e' : '#6b7280',
                    border: '3px solid rgba(0,0,0,0.8)',
                    animation: isOnline ? `${pulseOnline} 2s infinite` : 'none',
                  }}
                />
              }
            >
              <Avatar
                sx={{
                  mr: 2,
                  width: 50,
                  height: 50,
                  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <FaUserCircle size={26} />
              </Avatar>
            </Badge>

            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#fff', 
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                {selectedUser.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                {isOnline && <MdOnlinePrediction size={14} color="#22c55e" />}
                <Typography
                  variant="body2"
                  sx={{
                    color: isOnline ? '#22c55e' : 'rgba(255, 255, 255, 0.6)',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                  }}
                >
                  {isOnline ? 'Active now' : 'Offline'}
                </Typography>
              </Box>
            </Box>
          </Box>

       
        </Paper>
      </Slide>

    
      <Box
        ref={messagesContainerRef}
        flex={1}
        sx={{
          overflow: 'auto',
          px: 2,
          py: 2,
          background: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
            borderRadius: '10px',
            '&:hover': {
              background: 'linear-gradient(45deg, #7c3aed, #2563eb)',
            },
          },
        }}
      >
        {withSeps.length === 0 ? (
          <Fade in timeout={800}>
            <Box
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mb: 3,
                  background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                  animation: `${floatMessage} 4s ease-in-out infinite`,
                }}
              >
                <FaPaperPlane size={32} />
              </Avatar>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                No messages yet
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  textAlign: 'center',
                }}
              >
                Start the conversation with {selectedUser.name}
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Box>
            {withSeps.map(({ type, date, ...msg }, index) =>
              type === 'sep' ? (
                <Fade key={msg.id} in timeout={500} style={{ transitionDelay: `${index * 50}ms` }}>
                  <Box textAlign="center" my={3}>
                    <Paper 
                      elevation={0} 
                      sx={{
                        display: 'inline-block', 
                        px: 3, 
                        py: 1, 
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: 500,
                        }}
                      >
                        {fmtDate(date)}
                      </Typography>
                    </Paper>
                  </Box>
                </Fade>
              ) : (
                <Slide 
                  key={msg._id} 
                  direction={msg.senderId === selectedUser._id ? 'right' : 'left'} 
                  in 
                  timeout={400}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Box 
                    display="flex"
                    justifyContent={msg.senderId === selectedUser._id ? 'flex-start' : 'flex-end'} 
                    mb={2}
                    sx={{
                      animation: `${messageSlideIn} 0.5s ease-out`,
                    }}
                  >
                    <Paper 
                      sx={{
                        p: 2, 
                        borderRadius: msg.senderId === selectedUser._id ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
                        maxWidth: '70%',
                        background: msg.senderId === selectedUser._id
                          ? 'rgba(255, 255, 255, 0.15)'
                          : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        animation: `${floatMessage} 6s ease-in-out infinite`,
                        animationDelay: `${index * 0.5}s`,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: msg.senderId === selectedUser._id
                            ? '0 8px 25px rgba(255, 255, 255, 0.2)'
                            : '0 8px 25px rgba(59, 130, 246, 0.4)',
                        },
                      }}
                    >
                      {msg.image ? (
                        <Box>
                          {msg.image.startsWith("data:video") ? (
                            <video
                              src={msg.image}
                              controls
                              style={{ 
                                width: '100%', 
                                maxWidth: '300px',
                                borderRadius: 12,
                                marginBottom: 8,
                              }}
                            />
                          ) : (
                            <img
                              src={msg.image}
                              alt="sent"
                              style={{ 
                                width: '100%', 
                                maxWidth: '300px',
                                borderRadius: 12,
                                marginBottom: 8,
                              }}
                            />
                          )}
                        </Box>
                      ) : (
                        <Typography 
                          sx={{ 
                            color: 'white',
                            fontSize: '0.95rem',
                            lineHeight: 1.4,
                            wordBreak: 'break-word',
                          }}
                        >
                          {msg.text}
                        </Typography>
                      )}
                      
                      <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                        mt={1}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.75rem',
                          }}
                        >
                          {fmtTime(msg.createdAt)}
                        </Typography>
                        
                        {msg.senderId !== selectedUser._id && (
                          <Box sx={{ ml: 1 }}>
                            <FaCheckDouble size={12} color="rgba(255,255,255,0.6)" />
                          </Box>
                        )}
                      </Box>
                    </Paper>
                  </Box>
                </Slide>
              )
            )}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Box>

     
      <Slide direction="up" in timeout={600} style={{ transitionDelay: '300ms' }}>
        <Box 
          sx={{ 
            borderTop: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <ChatInput />
        </Box>
      </Slide>
    </Box>
  );
};

export default ChatContainer;