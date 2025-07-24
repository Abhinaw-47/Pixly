import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import CartoonAvatar from './CartoonAvatar'; // We will reuse the avatar component
import { FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProfileHeader = ({ profileData }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long',
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Paper
        elevation={0}
        sx={{
          p: {xs: 2, md: 4},
          borderRadius: '24px',
          background: 'rgba(28, 28, 45, 0.7)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          mb: 4,
          textAlign: 'center'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CartoonAvatar name={profileData?.name} size={120} />
        </Box>

        <Typography variant="h4" fontWeight={700} color="white">{profileData?.name || 'User'}</Typography>
        <Typography color="rgba(255, 255, 255, 0.6)" sx={{ mb: 2 }}>@{profileData?.username || 'username'}</Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, color: 'rgba(255, 255, 255, 0.6)', mb: 3 }}>
            <FaCalendarAlt />
            <Typography variant="body2">Joined {formatDate(profileData?.joinedDate)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: {xs: 2, sm: 4}, mb: 3 }}>
            <Box>
                <Typography variant="h5" fontWeight={700} color="#00FFFF">{profileData?.postCount}</Typography>
                <Typography color="rgba(255, 255, 255, 0.6)">Posts</Typography>
            </Box>
            <Box>
                <Typography variant="h5" fontWeight={700} color="#00FFFF">{profileData?.followers}</Typography>
                <Typography color="rgba(255, 255, 255, 0.6)">Followers</Typography>
            </Box>
            <Box>
                <Typography variant="h5" fontWeight={700} color="#00FFFF">{profileData?.following}</Typography>
                <Typography color="rgba(255, 255, 255, 0.6)">Following</Typography>
            </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default ProfileHeader;