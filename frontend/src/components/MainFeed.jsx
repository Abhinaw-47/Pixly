import React, { useEffect } from 'react';
import { Box, TextField, InputAdornment, Typography, Container } from '@mui/material';
import { FaSearch, FaGhost } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../actions/post'; 
import Posts from './Posts/Posts';
import CustomPagination from './CustomPagination';
import Footer from './Footer'; 

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

const MainFeed = ({ search, setSearch, handleSearch, handleKeyDown, setCurrentId, setShowForm, page, searchQuery }) => {
  const { posts, isLoading } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!posts.length) {
      dispatch(getPosts(page));
    }
  }, [dispatch, page, posts.length]);

  return (
    <Box sx={{ 
        height: '100%', 
        overflowY: 'auto', 
        p: { xs: 1, sm: 2, md: 3 }, 
        '&::-webkit-scrollbar': { width: '6px' }, 
        '&::-webkit-scrollbar-track': { background: 'transparent' }, 
        '&::-webkit-scrollbar-thumb': { background: 'rgba(0, 255, 255, 0.3)', borderRadius: '10px' }
    }}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Box sx={{ mb: 3, position: 'relative' }}>
            <TextField
                fullWidth
                placeholder="Search..."
                variant="standard"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                InputProps={{
                    disableUnderline: true,
                    sx: { 
                        color: 'white', 
                        p: '12px 16px',
                        background: 'rgba(28, 28, 45, 0.7)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                    },
                    endAdornment: (
                        <InputAdornment position="end">
                            <FaSearch onClick={handleSearch} style={{ color: '#00FFFF', cursor: 'pointer' }} />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>

        {(!posts?.length && !isLoading) ? <EmptyState /> : <Posts setCurrentId={setCurrentId} setShowForm={setShowForm} />}

        {!searchQuery && posts?.length > 0 && (
          <Box display="flex" justifyContent="center" mt={4} pb={4}>
            <CustomPagination page={page} />
          </Box>
        )}

        <Footer />
      </Box>
    </Box>
  );
};

export default MainFeed;