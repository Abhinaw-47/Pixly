import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
// ✨ FIX: Import FaQuestionCircle from 'fa' instead of the non-existent icon
import { FaHome, FaQuestionCircle } from 'react-icons/fa'; 
import { MdArrowBack } from 'react-icons/md';
import { motion } from 'framer-motion';

import Background from './Background';
import Footer from './Footer';

const NotFound = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Background />
      
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, zIndex: 1, mt: '88px' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: '24px',
              maxWidth: 600,
              background: 'rgba(13, 13, 27, 0.7)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #00FFFF, #2E73E8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)',
                  }}
                >
                  {/* ✨ FIX: Replaced the broken icon with a valid one */}
                  <FaQuestionCircle size={50} color="#000" />
                </Box>
              </Box>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '6rem', sm: '8rem' },
                  background: 'linear-gradient(45deg, #FFFFFF, #AAAAAA)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
                }}
              >
                404
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Page Not Found
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4, maxWidth: 400, mx: 'auto' }}>
                It seems you've ventured into uncharted territory. The page you're looking for doesn't exist.
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/"
                  variant="contained"
                  startIcon={<FaHome />}
                  sx={{
                    background: 'linear-gradient(45deg, #00FFFF, #2E73E8)',
                    color: '#000',
                    px: 4, py: 1.5,
                    fontSize: '1rem', fontWeight: 700, borderRadius: '20px',
                    textTransform: 'none',
                    '&:hover': { transform: 'translateY(-3px) scale(1.05)', boxShadow: '0 10px 25px rgba(0, 255, 255, 0.3)'},
                  }}
                >
                  Go Home
                </Button>
                <Button
                  onClick={() => window.history.back()}
                  variant="outlined"
                  startIcon={<MdArrowBack />}
                  sx={{
                    color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)',
                    px: 4, py: 1.5, fontSize: '1rem', fontWeight: 600,
                    borderRadius: '20px', textTransform: 'none',
                    background: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': { background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.5)'},
                  }}
                >
                  Go Back
                </Button>
              </Box>
            </motion.div>
          </Paper>
        </motion.div>
      </Box>

      <Box sx={{ zIndex: 1, width: '100%' }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default NotFound;