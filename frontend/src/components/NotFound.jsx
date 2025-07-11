import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import { FaHome, FaRocket, FaSadTear } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { keyframes } from '@mui/system';


const float404 = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotateX(0deg) rotateY(0deg);
  }
  25% { 
    transform: translateY(-20px) rotateX(5deg) rotateY(2deg);
  }
  50% { 
    transform: translateY(-10px) rotateX(-3deg) rotateY(-2deg);
  }
  75% { 
    transform: translateY(-30px) rotateX(2deg) rotateY(1deg);
  }
`;

const glitch = keyframes`
  0%, 100% { 
    transform: translate(0);
    filter: hue-rotate(0deg);
  }
  10% { 
    transform: translate(-2px, 2px);
    filter: hue-rotate(90deg);
  }
  20% { 
    transform: translate(-2px, -2px);
    filter: hue-rotate(180deg);
  }
  30% { 
    transform: translate(2px, 2px);
    filter: hue-rotate(270deg);
  }
  40% { 
    transform: translate(2px, -2px);
    filter: hue-rotate(360deg);
  }
  50% { 
    transform: translate(-2px, 2px);
    filter: hue-rotate(45deg);
  }
  60% { 
    transform: translate(-2px, -2px);
    filter: hue-rotate(135deg);
  }
  70% { 
    transform: translate(2px, 2px);
    filter: hue-rotate(225deg);
  }
  80% { 
    transform: translate(-2px, -2px);
    filter: hue-rotate(315deg);
  }
  90% { 
    transform: translate(2px, 2px);
    filter: hue-rotate(405deg);
  }
`;

const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(236, 72, 153, 0.4),
                0 0 40px rgba(139, 92, 246, 0.2),
                inset 0 0 20px rgba(236, 72, 153, 0.1);
  }
  50% { 
    box-shadow: 0 0 40px rgba(236, 72, 153, 0.6),
                0 0 80px rgba(139, 92, 246, 0.4),
                inset 0 0 40px rgba(236, 72, 153, 0.2);
  }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const slideBackground = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const bounceButton = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const NotFound = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 30% 40%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #000000 0%, #1a0033 25%, #2a003f 50%, #1a0033 75%, #000000 100%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        position: 'relative',
        overflow: 'hidden',
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
        {[...Array(30)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              background: i % 2 === 0 
                ? 'rgba(236, 72, 153, 0.6)' 
                : 'rgba(139, 92, 246, 0.6)',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `${sparkle} ${2 + i * 0.1}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </Box>

      <Fade in={mounted} timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: '30px',
            textAlign: 'center',
            background: `
              linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)),
              linear-gradient(45deg, transparent 30%, rgba(236, 72, 153, 0.1) 50%, transparent 70%)
            `,
            backdropFilter: 'blur(25px)',
            color: 'white',
            maxWidth: 600,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            animation: `${pulseGlow} 4s ease-in-out infinite`,
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
              animation: `${slideBackground} 3s ease-in-out infinite`,
            },
          }}
        >
        
          <Zoom in={mounted} timeout={1000} style={{ transitionDelay: '200ms' }}>
            <Box
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 4,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #ec4899, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `${float404} 6s ease-in-out infinite`,
                border: '3px solid rgba(255, 255, 255, 0.3)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <FaSadTear size={40} color="white" />
            </Box>
          </Zoom>

          
          <Slide direction="down" in={mounted} timeout={800} style={{ transitionDelay: '400ms' }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
                background: 'linear-gradient(45deg, #ec4899, #8b5cf6, #3b82f6)',
                backgroundSize: '300% 100%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                position: 'relative',
                zIndex: 1,
                animation: `${glitch} 2s ease-in-out infinite`,
                textShadow: '0 0 50px rgba(236, 72, 153, 0.5)',
                '&::before': {
                  content: '"404"',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, #3b82f6, #ec4899)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  opacity: 0.3,
                  zIndex: -1,
                  animation: `${glitch} 2s ease-in-out infinite reverse`,
                },
              }}
            >
              404
            </Typography>
          </Slide>

         
          <Slide direction="up" in={mounted} timeout={800} style={{ transitionDelay: '600ms' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'white',
                fontWeight: 700,
                mb: 2,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Oops! Page Not Found
            </Typography>
          </Slide>

          <Slide direction="up" in={mounted} timeout={800} style={{ transitionDelay: '700ms' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 2,
                fontWeight: 300,
                position: 'relative',
                zIndex: 1,
              }}
            >
              The page you're looking for seems to have vanished into the digital void.
            </Typography>
          </Slide>

          <Slide direction="up" in={mounted} timeout={800} style={{ transitionDelay: '800ms' }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                mb: 5,
                lineHeight: 1.6,
                maxWidth: 400,
                mx: 'auto',
                position: 'relative',
                zIndex: 1,
              }}
            >
              Don't worry though, even the best explorers sometimes take a wrong turn. 
              Let's get you back on track!
            </Typography>
          </Slide>

         
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Zoom in={mounted} timeout={800} style={{ transitionDelay: '900ms' }}>
              <Button
                component={Link}
                to="/"
                variant="contained"
                startIcon={<FaHome />}
                sx={{
                  background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                  color: 'white',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: '20px',
                  textTransform: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `${bounceButton} 2s ease-in-out infinite`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2563eb, #1d4ed8)',
                    transform: 'translateY(-5px) scale(1.05)',
                    boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4)',
                    animation: 'none',
                  },
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
                        rgba(255, 255, 255, 0.2), 
                        transparent
                      )
                    `,
                    transition: 'left 0.6s',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                }}
              >
                Go Home
              </Button>
            </Zoom>

            <Zoom in={mounted} timeout={800} style={{ transitionDelay: '1000ms' }}>
              <Button
                onClick={() => window.history.back()}
                variant="outlined"
                startIcon={<MdArrowBack />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '20px',
                  textTransform: 'none',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 25px rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                Go Back
              </Button>
            </Zoom>
          </Box>

        
          <Fade in={mounted} timeout={1000} style={{ transitionDelay: '1200ms' }}>
            <Box sx={{ mt: 6, position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                }}
              >
                "Not all who wander are lost... but this page definitely is!" 🚀
              </Typography>
            </Box>
          </Fade>

        
          <Fade in={mounted} timeout={1000} style={{ transitionDelay: '1300ms' }}>
            <Typography
              variant="caption"
              display="block"
              sx={{ 
                mt: 4, 
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '0.75rem',
                position: 'relative',
                zIndex: 1,
              }}
            >
              © 2025 CONNECTIFY by ABHINAW ANAND
            </Typography>
          </Fade>
        </Paper>
      </Fade>
    </Box>
  );
};

export default NotFound;