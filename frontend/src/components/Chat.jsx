import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Avatar, List, ListItemButton, ListItemText, ListItemAvatar, Divider, Paper, useMediaQuery, Badge, InputBase } from '@mui/material';
import { FaSearch } from 'react-icons/fa';

import ChatContainer from './ChatContainer';
import { connectSocket } from '../api';
import { fetchUsers } from '../actions/message'; 
import Background from './Background';

const Chat = () => {
  const dispatch = useDispatch();
  const { users, selectedUser } = useSelector((state) => state.message);
  const { onlineUsers } = useSelector((state) => state.auth);
  const currentUser = JSON.parse(localStorage.getItem('profile'))?.result;
  const isMobile = useMediaQuery('(max-width:900px)');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    connectSocket();
    dispatch(fetchUsers());
  }, [dispatch]);

  // ✨ FIX: Simplified user list to show ALL users except the logged-in one.
  const filteredUsers = (users || []).filter(user =>
    user._id !== currentUser?._id &&
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const showUserList = isMobile ? !selectedUser : true;
  const showChat = isMobile ? selectedUser : true;

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', position: 'relative' }}>
      <Background />
      <Box sx={{ display: 'flex', flexGrow: 1, zIndex: 1, mt: '74px', height: 'calc(100vh - 88px)' }}>
        
        {showUserList && (
          <Paper
            elevation={0}
            sx={{
              width: { xs: '100%', md: '350px' },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(13, 13, 27, 0.7)',
              backdropFilter: 'blur(15px)',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box p={2}>
              <Typography variant="h5" fontWeight={700} sx={{ p: 1, color: 'white' }}>Chats</Typography>
              <Box sx={{ p: '4px 8px', display: 'flex', alignItems: 'center', borderRadius: '12px', background: 'rgba(28, 28, 45, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <FaSearch color="rgba(255,255,255,0.6)" />
                <InputBase sx={{ ml: 1, flex: 1, color: 'white' }} placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </Box>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
              {filteredUsers.map((user) => (
                  <ListItemButton
                    key={user._id}
                    selected={selectedUser?._id === user._id}
                    onClick={() => dispatch({ type: 'SELECT_USER', payload: user })}
                    sx={{ borderRadius: '12px', m: 1, p: 1.5, '&.Mui-selected': { background: 'linear-gradient(45deg, #00FFFF, #2E73E8)', '&:hover': { background: 'linear-gradient(45deg, #00E0E0, #1F63D8)' } } }}
                  >
                    <ListItemAvatar>
                      <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" invisible={!onlineUsers.includes(user._id)} sx={{ '& .MuiBadge-dot': { bgcolor: '#44b700', boxShadow: '0 0 0 2px #1C1C2D' }}}>
                        <Avatar sx={{ width: 48, height: 48 }}>{user.name.charAt(0).toUpperCase()}</Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText 
                        primary={user.name} 
                        secondary={onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                        primaryTypographyProps={{ color: 'white' }}
                        secondaryTypographyProps={{ color: selectedUser?._id === user._id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }}
                    />
                  </ListItemButton>
              ))}
            </List>
          </Paper>
        )}

        {showChat && (
          <Box flex={1} sx={{ display: 'flex', flexDirection: 'column' }}>
            <ChatContainer />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chat;