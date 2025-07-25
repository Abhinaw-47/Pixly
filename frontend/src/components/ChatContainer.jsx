import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages } from '../actions/message';
import { getProfile } from '../actions/post';
import ChatInput from './ChatInput';
import { Box, Paper, Typography, Avatar, useMediaQuery, IconButton, Badge } from '@mui/material';
import { FaUserCircle, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ChatContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser, messages } = useSelector((s) => s.message);
  const { onlineUsers } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery('(max-width:900px)');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      dispatch(getMessages(selectedUser._id));
    }
  }, [selectedUser, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fmtTime = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Function to detect if media is video (handles both data URLs and Cloudinary URLs)
  const isVideoFile = (url) => {
    return url && (
      url.startsWith('data:video') || 
      url.includes('/video/') ||
      url.match(/\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i)
    );
  };

  // Handle profile redirect
  const handleProfileClick = (userId) => {
    dispatch(getProfile({ profile: userId }));
    navigate(`/posts/profile/${userId}`);
  };

  if (!selectedUser) {
    return (
      <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ background: 'rgba(18, 18, 18, 0.7)', backdropFilter: 'blur(10px)' }}>
          <Avatar sx={{ width: 80, height: 80, mb: 3, background: 'linear-gradient(45deg, #00FFFF, #2E73E8)' }}>
            <FaUserCircle size={40} />
          </Avatar>
          <Typography variant="h5" fontWeight={700} color="white">Select a chat</Typography>
          <Typography color="rgba(255,255,255,0.7)">Start a conversation with your friends.</Typography>
      </Box>
    );
  }
  
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <Box display="flex" flexDirection="column" height="100%" sx={{ background: 'rgba(18, 18, 18, 0.7)', backdropFilter: 'blur(10px)'}}>
      <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', p: 2, background: 'rgba(13, 13, 27, 0.7)', backdropFilter: 'blur(15px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {isMobile && <IconButton onClick={() => dispatch({ type: 'SELECT_USER', payload: null })} sx={{ mr: 2, color: 'white' }}><FaArrowLeft /></IconButton>}
        
        {/* Clickable profile section */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            borderRadius: '12px',
            p: 1,
            transition: 'background 0.2s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.05)'
            }
          }}
          onClick={() => handleProfileClick(selectedUser._id)}
        >
          <Badge 
            overlap="circular" 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
            variant="dot" 
            invisible={!isOnline} 
            sx={{ '& .MuiBadge-dot': { bgcolor: '#44b700', boxShadow: '0 0 0 2px #1C1C2D' }}}
          >
            <Avatar sx={{ width: 48, height: 48 }}>
              {selectedUser.name.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>
          <Box ml={2}>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              color="white"
              sx={{
                '&:hover': {
                  textDecoration: 'underline',
                  textDecorationColor: '#00FFFF'
                }
              }}
            >
              {selectedUser.name}
            </Typography>
            <Typography variant="caption" sx={{ color: isOnline ? '#44b700' : 'rgba(255,255,255,0.6)' }}>
              {isOnline ? 'Online' : 'Offline'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box flex={1} sx={{ overflowY: 'auto', p: 2 }}>
        {messages.length === 0 ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                <Avatar sx={{ width: 80, height: 80, mb: 3, background: 'rgba(255,255,255,0.1)' }}>
                    <FaPaperPlane size={32} />
                </Avatar>
                <Typography variant="h6" fontWeight={600} color="white">No messages yet</Typography>
                <Typography color="rgba(255,255,255,0.7)">Say hello to {selectedUser.name}!</Typography>
            </Box>
        ) : (
            messages.map((msg, index) => {
                const isFromMe = msg.senderId !== selectedUser._id;
                const isVideo = isVideoFile(msg.image);
                
                return (
                    <motion.div key={msg._id || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                        <Box display="flex" justifyContent={isFromMe ? 'flex-end' : 'flex-start'} mb={2}>
                            <Box sx={{ maxWidth: '70%' }}>
                                <Paper sx={{ 
                                    p: msg.image ? 0.5 : '10px 15px', 
                                    borderRadius: isFromMe ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                                    background: isFromMe ? 'linear-gradient(45deg, #00FFFF, #2E73E8)' : '#2E2E38', 
                                    color: 'white',
                                    overflow: 'hidden',
                                }}>
                                    {msg.image && (
                                        <Box sx={{ position: 'relative' }}>
                                            {isVideo ? (
                                                <video 
                                                    src={msg.image}
                                                    controls
                                                    style={{ 
                                                        display: 'block',
                                                        width: '100%', 
                                                        maxWidth: '400px', 
                                                        maxHeight: '300px',
                                                        borderRadius: '16px',
                                                        marginBottom: msg.text ? '8px' : '0'
                                                    }}
                                                />
                                            ) : (
                                                <img 
                                                    src={msg.image}
                                                    alt="sent media"
                                                    style={{ 
                                                        display: 'block',
                                                        width: '100%', 
                                                        maxWidth: '400px', 
                                                        borderRadius: '16px',
                                                        marginBottom: msg.text ? '8px' : '0'
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    )}
                                    
                                    {msg.text && (
                                        <Typography variant="body1" sx={{ px: msg.image ? '10px' : 0, pb: msg.image ? '5px' : 0 }}>
                                            {msg.text}
                                        </Typography>
                                    )}
                                </Paper>
                                <Typography 
                                    variant="caption" 
                                    display="block" 
                                    textAlign={isFromMe ? 'right' : 'left'}
                                    sx={{ mt: 0.5, px: 1, color: 'rgba(255,255,255,0.6)' }}
                                >
                                    {fmtTime(msg.createdAt)}
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>
                )
            })
        )}
        <div ref={messagesEndRef} />
      </Box>

      <ChatInput />
    </Box>
  );
};

export default ChatContainer;