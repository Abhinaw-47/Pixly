import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { MdFlashOn } from 'react-icons/md'; 

const Footer = () => (
    <Box sx={{
        p: 4,
        mt: 4,
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
            <MdFlashOn size={28} color="#00FFFF" />
            <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                PIXLY
            </Typography>
        </Box>
        <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" sx={{ maxWidth: '500px', mx: 'auto', mb: 3 }}>
            PIXLY is a modern social platform designed for vibrant communities to share ideas, foster connections, and inspire creativity in a visually stunning environment.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton href="https://x.com/Abhinaw_Anand96" target="_blank" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#FFFFFF' } }}><FaTwitter /></IconButton>
            <IconButton href="https://github.com/Abhinaw-47" target="_blank" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#FFFFFF' } }}><FaGithub /></IconButton>
            <IconButton href="https://www.linkedin.com/in/abhinaw-anand-04a64124a/" target="_blank" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#FFFFFF' } }}><FaLinkedin /></IconButton>
        </Box>
        <Typography variant="caption" color="rgba(255, 255, 255, 0.4)" sx={{ display: 'block', mt: 3 }}>
            © {new Date().getFullYear()} PIXLY. All Rights Reserved.
        </Typography>
    </Box>
);

export default Footer;