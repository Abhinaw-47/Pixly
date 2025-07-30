import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Avatar, List, ListItemButton, ListItemText, ListItemAvatar, Divider, Paper, useMediaQuery, Badge, InputBase } from '@mui/material';
import { FaSearch } from 'react-icons/fa';

import ChatContainer from './ChatContainer';
import { connectSocket, addSocketListener, emitSocketEvent } from '../api';
import { fetchUsers } from '../actions/message'; 
import Background from './Background';

const Chat = () => {
    const dispatch = useDispatch();
    const { users, selectedUser } = useSelector((state) => state.message);
    const { onlineUsers } = useSelector((state) => state.auth);
    const currentUser = JSON.parse(localStorage.getItem('profile'))?.result;
    const isMobile = useMediaQuery('(max-width:900px)');
    const [searchTerm, setSearchTerm] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        if (!currentUser?._id) return;
        
        dispatch(fetchUsers());
        const socket = connectSocket();

        if (socket) {
            const onConnect = () => {
                setSocketConnected(true);
                emitSocketEvent('getOnlineUsers');
            };
            const onDisconnect = () => setSocketConnected(false);
            const onOnlineUsers = (users) => dispatch({ type: 'UPDATE_ONLINE_USERS', payload: users });

            addSocketListener('connect', onConnect);
            addSocketListener('disconnect', onDisconnect);
            addSocketListener('getOnlineUsers', onOnlineUsers);
            
            if (socket.connected) onConnect();

            return () => {
                socket.off('connect', onConnect);
                socket.off('disconnect', onDisconnect);
                socket.off('getOnlineUsers', onOnlineUsers);
            };
        }
    }, [dispatch, currentUser?._id]);

    const handleUserSelect = (user) => {
        dispatch({ type: 'SELECT_USER', payload: user });
    };

    
    const sendMessage = (messageText, imageFile) => {
        if (selectedUser && currentUser?._id && (messageText.trim() || imageFile) && socketConnected) {
            const data = {
                receiverId: selectedUser._id,
                message: messageText,
                image: imageFile || null,
            };
            
            emitSocketEvent('sendMessage', data);
        }
    };
    
   
    const handleTyping = (isTyping) => {
        if (selectedUser && currentUser?._id && socketConnected) {
            emitSocketEvent('typing', {
                receiverId: selectedUser._id,
                isTyping: isTyping
            });
        }
    };

    const filteredUsers = (users || []).filter(user =>
        user._id !== currentUser?._id &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const showUserList = isMobile ? !selectedUser : true;
    const showChat = isMobile ? !!selectedUser : true;

    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', position: 'relative' }}>
            <Background />
            <Box sx={{ display: 'flex', flexGrow: 1, zIndex: 1, mt: '74px', height: 'calc(100vh - 88px)' }}>
                {showUserList && (
                    <Paper elevation={0} sx={{ width: { xs: '100%', md: '350px' }, height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(13, 13, 27, 0.7)', backdropFilter: 'blur(15px)', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Box p={2}>
                            <Typography variant="h5" fontWeight={700} sx={{ p: 1, color: 'white' }}>
                                Chats
                                <Typography component="span" variant="caption" sx={{ ml: 1, color: socketConnected ? '#44b700' : '#ff6b6b' }}>
                                    {socketConnected ? '● Connected' : '● Connecting...'}
                                </Typography>
                            </Typography>
                            <Box sx={{ p: '4px 8px', display: 'flex', alignItems: 'center', borderRadius: '12px', background: 'rgba(28, 28, 45, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <FaSearch color="rgba(255,255,255,0.6)" />
                                <InputBase sx={{ ml: 1, flex: 1, color: 'white' }} placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </Box>
                        </Box>
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                        <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                            {filteredUsers.map((user) => {
                                const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(user._id);
                                return (
                                    <ListItemButton key={user._id} selected={selectedUser?._id === user._id} onClick={() => handleUserSelect(user)} sx={{ borderRadius: '12px', m: 1, p: 1.5, '&.Mui-selected': { background: 'linear-gradient(45deg, #00FFFF, #2E73E8)' } }}>
                                        <ListItemAvatar>
                                            <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" invisible={!isOnline} sx={{ '& .MuiBadge-dot': { bgcolor: '#44b700' } }}>
                                                <Avatar sx={{ width: 48, height: 48 }}>{user.name.charAt(0).toUpperCase()}</Avatar>
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText primary={user.name} secondary={isOnline ? 'Online' : 'Offline'} primaryTypographyProps={{ color: 'white' }} secondaryTypographyProps={{ color: 'rgba(255,255,255,0.6)' }} />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </Paper>
                )}
                {showChat && (
                    <Box flex={1} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <ChatContainer onSendMessage={sendMessage} onTyping={handleTyping} />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Chat;