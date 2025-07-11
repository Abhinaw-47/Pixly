import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Post from './post/Post';
import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Container,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import { MdExplore, MdRocketLaunch } from 'react-icons/md';
import { FaSearch, FaHeart, FaUsers } from 'react-icons/fa';
import { keyframes } from '@mui/system';


const floatLoader = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
  }
  25% { 
    transform: translateY(-10px) rotate(5deg);
  }
  50% { 
    transform: translateY(-5px) rotate(-5deg);
  }
  75% { 
    transform: translateY(-15px) rotate(3deg);
  }
`;

const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.4),
                0 0 40px rgba(139, 92, 246, 0.2),
                0 0 60px rgba(59, 130, 246, 0.1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(99, 102, 241, 0.6),
                0 0 60px rgba(139, 92, 246, 0.4),
                0 0 90px rgba(59, 130, 246, 0.2);
  }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const shimmerWave = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const Posts = ({ setCurrentId, setShowForm }) => {
  const { posts, isLoading } = useSelector((state) => state.post);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  
  const EmptyState = () => (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Fade in={mounted} timeout={1000}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: '60vh',
            position: 'relative',
          }}
        >
         
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            {[...Array(8)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: '20px',
                  height: '20px',
                  background: `linear-gradient(45deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))`,
                  borderRadius: '50%',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `${floatLoader} ${4 + i}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </Box>

          <Zoom in={mounted} timeout={1200} style={{ transitionDelay: '300ms' }}>
            <Paper
              elevation={0}
              sx={{
                p: 6,
                borderRadius: '30px',
                background: `
                  linear-gradient(145deg, rgba(22, 0, 35, 0.9), rgba(35, 0, 60, 0.8)),
                  linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)
                `,
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                position: 'relative',
                overflow: 'hidden',
                animation: `${pulseGlow} 4s ease-in-out infinite`,
                maxWidth: 500,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: `
                    conic-gradient(
                      from 0deg,
                      transparent,
                      rgba(139, 92, 246, 0.1),
                      transparent,
                      rgba(59, 130, 246, 0.1),
                      transparent
                    )
                  `,
                  animation: `${floatLoader} 8s linear infinite`,
                  zIndex: -1,
                },
              }}
            >
              
              {[...Array(6)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: '4px',
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '50%',
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                    animation: `${sparkle} ${2 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}

              <Avatar 
                sx={{ 
                  bgcolor: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                  width: 80, 
                  height: 80, 
                  mb: 3,
                  mx: 'auto',
                  border: '3px solid rgba(255, 255, 255, 0.2)',
                  animation: `${floatLoader} 6s ease-in-out infinite`,
                }}
              >
                <MdExplore size={40} />
              </Avatar>

              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#fff',
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(45deg, #ffffff, #e0e0ff)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                No Posts Yet
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 3,
                  fontWeight: 300,
                }}
              >
                The journey begins with your first post
              </Typography>

              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  lineHeight: 1.6,
                  maxWidth: 400,
                  mx: 'auto',
                }}
              >
                Share your thoughts, connect with others, and become part of our growing community. 
                Your story matters!
              </Typography>

           
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                {[
                  { icon: FaHeart, text: 'Share', color: '#ef4444' },
                  { icon: FaUsers, text: 'Connect', color: '#3b82f6' },
                  { icon: MdRocketLaunch, text: 'Explore', color: '#8b5cf6' },
                ].map((item, i) => (
                  <Zoom key={i} in={mounted} timeout={800} style={{ transitionDelay: `${600 + i * 200}ms` }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        p: 2,
                        borderRadius: '15px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-3px)',
                        },
                      }}
                    >
                      <item.icon size={24} color={item.color} />
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {item.text}
                      </Typography>
                    </Box>
                  </Zoom>
                ))}
              </Box>
            </Paper>
          </Zoom>
        </Box>
      </Fade>
    </Container>
  );

 
  const LoadingState = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Fade in={isLoading} timeout={800}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            textAlign: 'center',
            position: 'relative',
          }}
        >
         
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            {[...Array(12)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: `${15 + Math.random() * 25}px`,
                  height: `${15 + Math.random() * 25}px`,
                  background: `linear-gradient(45deg, 
                    rgba(139, 92, 246, ${0.2 + Math.random() * 0.3}), 
                    rgba(59, 130, 246, ${0.2 + Math.random() * 0.3})
                  )`,
                  borderRadius: '50%',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `${floatLoader} ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 8,
              borderRadius: '30px',
              background: `
                linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(31, 41, 55, 0.9)),
                linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)
              `,
              backdropFilter: 'blur(25px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              position: 'relative',
              overflow: 'hidden',
              maxWidth: 400,
              animation: `${pulseGlow} 3s ease-in-out infinite`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: `
                  linear-gradient(
                    90deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.1), 
                    transparent
                  )
                `,
                animation: `${shimmerWave} 2s ease-in-out infinite`,
              },
            }}
          >
         
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
              <CircularProgress 
                size={60}
                thickness={3}
                sx={{ 
                  color: '#8b5cf6',
                  animation: `${floatLoader} 2s ease-in-out infinite`,
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MdRocketLaunch size={24} color="#8b5cf6" />
              </Box>
            </Box>

            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Loading Posts...
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 300,
              }}
            >
              Preparing amazing content for you
            </Typography>

           
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                    animation: `${sparkle} 1.5s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );

  if (!posts?.length && !isLoading) return <EmptyState />;
  if (isLoading) return <LoadingState />;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in={mounted} timeout={1000}>
        <Grid
          container
          spacing={4}
          sx={{ 
            justifyContent: 'center',
            position: 'relative',
          }}
        >
        
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            {[...Array(8)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: '100px',
                  height: '100px',
                  background: `radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent)`,
                  borderRadius: '50%',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `${floatLoader} ${8 + i * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </Box>

          {posts.map((post, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              lg={4} 
              xl={3}
              key={post._id}
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Slide 
                direction="up" 
                in={mounted} 
                timeout={800} 
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 480,
                    position: 'relative',
                    '&:hover': {
                      '& .post-glow': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                 
                  <Box
                    className="post-glow"
                    sx={{
                      position: 'absolute',
                      top: -20,
                      left: -20,
                      right: -20,
                      bottom: -20,
                      background: `
                        radial-gradient(
                          circle at center,
                          rgba(139, 92, 246, 0.2),
                          transparent 70%
                        )
                      `,
                      borderRadius: '35px',
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                      pointerEvents: 'none',
                      zIndex: -1,
                    }}
                  />
                  
                  <Post 
                    post={post} 
                    setCurrentId={setCurrentId} 
                    setShowForm={setShowForm} 
                  />
                </Box>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Fade>
    </Container>
  );
};

export default Posts;