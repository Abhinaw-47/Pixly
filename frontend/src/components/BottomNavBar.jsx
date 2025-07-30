import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';

import { FaHome, FaPlusCircle, FaCommentDots, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BottomNavBar = ({ onShowForm }) => {
    const navigate = useNavigate();

    return (
        <Paper 
            sx={{ 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                zIndex: 1100, 
                display: { xs: 'block', md: 'none' },
                background: 'rgba(13, 13, 27, 0.8)',
                backdropFilter: 'blur(15px)',
            }} 
            elevation={3}
        >
            <BottomNavigation
                showLabels
                sx={{ background: 'transparent' }}
            >
                <BottomNavigationAction label="Home" icon={<FaHome />} sx={{ color: 'white' }} onClick={() => navigate('/posts')} />
                
                
                <BottomNavigationAction label="Liked" icon={<FaHeart />} sx={{ color: 'white' }} onClick={() => navigate('/posts/likes')} />

                <BottomNavigationAction label="Post" icon={<FaPlusCircle size={28} />} sx={{ color: '#00FFFF' }} onClick={onShowForm} />
                <BottomNavigationAction label="Chat" icon={<FaCommentDots />} sx={{ color: 'white' }} onClick={() => navigate('/chat')} />
            </BottomNavigation>
        </Paper>
    );
}

export default BottomNavBar;