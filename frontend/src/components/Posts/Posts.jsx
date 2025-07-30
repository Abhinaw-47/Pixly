import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Box, CircularProgress, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import Post from './post/Post';
import PostSkeleton from './post/PostSkeleton';
import { FaGhost } from "react-icons/fa";

const LoadingState = () => (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 3,
      '@media (max-width: 600px)': {
        gridTemplateColumns: '1fr'
      }
    }}>
      {[...Array(6)].map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </Box>
);

const EmptyState = () => (
    <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: '60vh', justifyContent: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>
            <FaGhost size={60} />
            <Typography variant="h5" fontWeight={700} sx={{ mt: 3, color: 'rgba(255, 255, 255, 0.8)' }}>
                Nothing to see here... yet.
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
                Be the first to share something amazing with the community!
            </Typography>
        </Box>
    </Container>
);

const Posts = ({ setCurrentId, setShowForm }) => {
  const { posts, isLoading } = useSelector((state) => state.post);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) return <LoadingState />;
  if (!posts?.length) return <EmptyState />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 3,
        '@media (max-width: 600px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        {posts.map((post) => (
          <motion.div 
            key={post._id}
            variants={itemVariants}
            style={{ 
              width: '100%',
              minHeight: '500px',
              display: 'flex'
            }}
          >
            <Post 
              post={post} 
              setCurrentId={setCurrentId} 
              setShowForm={setShowForm} 
            />
          </motion.div>
        ))}
      </Box>
    </motion.div>
  );
};

export default Posts;