import React from 'react';
import { Box, Paper, Typography, Grid, Avatar, Link as MuiLink } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';

const SuggestedUsers = () => {
    const { users } = useSelector((state) => state.message);
    const currentUser = JSON.parse(localStorage.getItem('profile'))?.result;
    const { profileId } = useParams(); // Get the ID of the profile being viewed
    
    // Suggest other users, excluding the current logged-in user AND the profile owner
    const suggested = (users || []).filter(user => user._id !== currentUser?._id && user._id !== profileId).slice(0, 6);
    
    if (suggested.length === 0) return null;

    return (
        <Box sx={{ height: '100%', overflowY: 'auto', p: 2 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    borderRadius: '24px',
                    background: 'rgba(28, 28, 45, 0.7)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <FaUsers color="#00FFFF" />
                  <Typography variant="h6" fontWeight={600} color="white">Suggested For You</Typography>
                </Box>
                <Grid container spacing={2}>
                    {suggested.map((user) => (
                        <Grid item xs={6} key={user._id}>
                           <MuiLink component={Link} to={`/posts/profile/${user._id}`} sx={{ textDecoration: 'none' }}>
                             <Box sx={{ textAlign: 'center', p:1, borderRadius: '12px', transition: 'background-color 0.3s ease', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 1, background: 'linear-gradient(45deg, #00FFFF, #2E73E8)' }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography noWrap color="white" fontWeight={500}>{user.name}</Typography>
                             </Box>
                           </MuiLink>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default SuggestedUsers;