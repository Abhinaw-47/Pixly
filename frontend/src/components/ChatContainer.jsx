import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages } from '../actions/message';
import { getProfile } from '../actions/post';
import ChatInput from './ChatInput';
import { Box, Paper, Typography, Avatar, useMediaQuery, IconButton, Badge } from '@mui/material';
import { FaUserCircle, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { connectSocket, getSocket } from '../api';

const ChatContainer = ({ onSendMessage, onTyping }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedUser, messages } = useSelector((s) => s.message);
    const { onlineUsers } = useSelector((state) => state.auth);
    const isMobile = useMediaQuery('(max-width:900px)');
    const messagesEndRef = useRef(null);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const currentUser = JSON.parse(localStorage.getItem('profile'))?.result;

    // useEffect(() => {
    //     if (selectedUser) {
    //         dispatch(getMessages(selectedUser._id));
    //     }
    // }, [selectedUser, dispatch]);

    // useEffect(() => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // }, [messages]);

    // useEffect(() => {
    //     const socket = getSocket();
    //     if (socket) {
    //         const handleUserTyping = (data) => {
    //             if (data.senderId === selectedUser?._id) {
    //                 setTypingUsers(prev => {
    //                     const newSet = new Set(prev);
    //                     data.isTyping ? newSet.add(data.senderId) : newSet.delete(data.senderId);
    //                     return newSet;
    //                 });
    //             }
    //         };

    //         const handleNewMessage = (messageData) => {
    //             // This condition now works for both incoming and your own echoed messages
    //             if ((messageData.senderId === selectedUser?._id && messageData.receiverId === currentUser?._id) ||
    //                 (messageData.senderId === currentUser?._id && messageData.receiverId === selectedUser?._id)) {
                    
    //                 dispatch({
    //                     type: 'RECEIVE_MESSAGE',
    //                     payload: {
    //                         senderId: messageData.senderId,
    //                         receiverId: messageData.receiverId,
    //                         text: messageData.message,      // <-- FIX: Map 'message' to 'text'
    //                         image: messageData.image,
    //                         createdAt: messageData.timestamp, // <-- FIX: Map 'timestamp' to 'createdAt'
    //                         _id: messageData.timestamp + Math.random() 
    //                     }
    //                 });
    //             }
    //         };

    //         socket.off('userTyping').on('userTyping', handleUserTyping);
    //         socket.off('newMessage').on('newMessage', handleNewMessage);

    //         return () => {
    //             socket.off('userTyping', handleUserTyping);
    //             socket.off('newMessage', handleNewMessage);
    //         };
    //     }
    // }, [selectedUser, currentUser?._id, dispatch]);

    const handleSendMessage = (messageText, imageFile) => {
        if (onSendMessage) {
            onSendMessage(messageText, imageFile);
        }
    };
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


    const handleTyping = (isTyping) => {
        if (onTyping) {
            onTyping(isTyping);
        }
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

    const fmtTime = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isVideoFile = (url) => url && (url.startsWith('data:video') || url.includes('/video/') || url.match(/\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i));
    const handleProfileClick = (userId) => navigate(`/posts/profile/${userId}`);
    const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(selectedUser._id);
    const isUserTyping = typingUsers.has(selectedUser._id);

    return (
        <Box display="flex" flexDirection="column" height="100%" sx={{ background: 'rgba(18, 18, 18, 0.7)', backdropFilter: 'blur(10px)'}}>
            {/* Header */}
            <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', p: 2, background: 'rgba(13, 13, 27, 0.7)', backdropFilter: 'blur(15px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {isMobile && <IconButton onClick={() => dispatch({ type: 'SELECT_USER', payload: null })} sx={{ mr: 2, color: 'white' }}><FaArrowLeft /></IconButton>}
                <Box onClick={() => handleProfileClick(selectedUser._id)} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" invisible={!isOnline} sx={{ '& .MuiBadge-dot': { bgcolor: '#44b700' }}}>
                        <Avatar sx={{ width: 48, height: 48 }}>{selectedUser.name.charAt(0).toUpperCase()}</Avatar>
                    </Badge>
                    <Box ml={2}>
                        <Typography variant="h6" fontWeight={600} color="white">{selectedUser.name}</Typography>
                        <Typography variant="caption" sx={{ color: isUserTyping ? '#00FFFF' : isOnline ? '#44b700' : 'rgba(255,255,255,0.6)' }}>
                            {isUserTyping ? 'typing...' : isOnline ? 'Online' : 'Offline'}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Messages */}
            <Box flex={1} sx={{ overflowY: 'auto', p: 2 }}>
                {messages.map((msg, index) => {
                    const isFromMe = msg.senderId !== selectedUser._id;
                    const isVideo = isVideoFile(msg.image || msg.text); 
                    return (
                        <motion.div key={msg._id || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <Box display="flex" justifyContent={isFromMe ? 'flex-end' : 'flex-start'} mb={2}>
                                <Box sx={{ maxWidth: '30%' }}>
                                    <Paper sx={{ p: (msg.text || msg.message) ? '10px 15px' : 0.5, borderRadius: isFromMe ? '20px 20px 5px 20px' : '20px 20px 20px 5px', background: isFromMe ? 'linear-gradient(45deg, #00FFFF, #2E73E8)' : '#2E2E38', color: 'white', overflow: 'hidden' }}>
                                        {msg.image && (isVideo ? <video src={msg.image} controls style={{ display: 'block', width: '100%', borderRadius: '16px' }} /> : <img src={msg.image} alt="media" style={{ display: 'block', width: '100%', borderRadius: '16px' }} />)}
                                        {(msg.text || msg.message) && <Typography variant="body1">{msg.text || msg.message}</Typography>}
                                    </Paper>
                                    <Typography variant="caption" display="block" textAlign={isFromMe ? 'right' : 'left'} sx={{ mt: 0.5, px: 1, color: 'rgba(255,255,255,0.6)' }}>
                                        {fmtTime(msg.createdAt || msg.timestamp)}
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    );
                })}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <ChatInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
        </Box>
    );
};

export default ChatContainer;