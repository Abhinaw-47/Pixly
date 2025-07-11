import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import { FaThumbsUp, FaTrash, FaEdit, FaHeart, FaPlay, FaUser } from 'react-icons/fa';
import { keyframes } from '@mui/system';
import { useDispatch } from 'react-redux';
import { deletePost, getPosts, getProfile, likePost } from '../../../actions/post';
import { useLocation, useNavigate } from 'react-router-dom';

// Advanced 3D animations
const float3D = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotateX(0deg) rotateY(0deg);
    box-shadow: 0 10px 40px rgba(139, 92, 246, 0.2);
  }
  25% { 
    transform: translateY(-5px) rotateX(2deg) rotateY(1deg);
    box-shadow: 0 15px 50px rgba(139, 92, 246, 0.3);
  }
  50% { 
    transform: translateY(-2px) rotateX(-1deg) rotateY(-1deg);
    box-shadow: 0 8px 35px rgba(139, 92, 246, 0.25);
  }
  75% { 
    transform: translateY(-8px) rotateX(1deg) rotateY(2deg);
    box-shadow: 0 20px 60px rgba(139, 92, 246, 0.35);
  }
`;

const heartPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;

const shimmerEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const tagFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(1deg); }
`;

const glowPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4), 
                0 0 40px rgba(59, 130, 246, 0.2),
                inset 0 0 20px rgba(139, 92, 246, 0.1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.6), 
                0 0 60px rgba(59, 130, 246, 0.4),
                inset 0 0 30px rgba(139, 92, 246, 0.2);
  }
`;

const Post = ({ post, setCurrentId, setShowForm }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('profile')));
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

 
const navigate = useNavigate();
 
   const [profile, setProfile] = useState('');
   const profileHandler = (profile) => {
  
      dispatch(getProfile( {profile} ));
      navigate(`/posts/profile/${profile}`);
      
    
  };
  //   useEffect(() => {
  //   if ({profile}) {
  //     dispatch(getProfile({profile}));
  //   }
  // }, [dispatch, profile]);
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    
  
    const diffInMs = now.getTime() - postTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) {
      return 'just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
     
      return postTime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: postTime.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    setUser(profile ? JSON.parse(profile) : null);
  }, [location]);

  useEffect(() => {
    if (user?.result && post.likes) {
      setIsLiked(post.likes.includes(user.result._id) || post.likes.includes(user.result.googleId));
    }
  }, [user, post.likes]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = () => {
    dispatch(likePost(post._id));
  };

  const handleDelete = () => {
    dispatch(deletePost(post._id));
    setShowDeleteConfirm(false);
  };

  const editHandler = () => {
    setCurrentId(post._id);
    setShowForm(true);
  };

  const isVideo = post.selectedFile?.startsWith('data:video');
  const isOwner = user?.result?.googleId === post?.creator || user?.result?._id === post?.creator;

  return (
    <>
      <Zoom in={isVisible} timeout={800} style={{ transitionDelay: '200ms' }}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: 480,
            mx: 'auto',
            my: 3,
            borderRadius: '24px',
            background: `
              linear-gradient(145deg, rgba(22, 0, 35, 0.95), rgba(35, 0, 60, 0.9)),
              linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)
            `,
            backdropFilter: 'blur(20px)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.15)',
            overflow: 'hidden',
            position: 'relative',
            transformStyle: 'preserve-3d',
            animation: `${float3D} 8s ease-in-out infinite`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px) rotateX(5deg) rotateY(2deg) scale(1.02)',
              animation: 'none',
              boxShadow: `
                0 25px 80px rgba(139, 92, 246, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.2),
                inset 0 0 40px rgba(139, 92, 246, 0.1)
              `,
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
                  rgba(255, 255, 255, 0.1), 
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
            {[...Array(6)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  background: `rgba(139, 92, 246, ${0.3 + Math.random() * 0.4})`,
                  borderRadius: '50%',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `${float3D} ${4 + i}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </Box>

          <Box 
            sx={{ 
              position: 'relative', 
              overflow: 'hidden',
              zIndex: 1,
            }}
          >
            <Fade in={imageLoaded || isVideo} timeout={800}>
              <Box>
                {isVideo ? (
                  <video
                    src={post.selectedFile}
                    controls
                    onLoadedData={() => setImageLoaded(true)}
                    style={{
                      width: '100%',
                      height: 280,
                      objectFit: 'cover',
                      borderTopLeftRadius: 24,
                      borderTopRightRadius: 24,
                    }}
                  />
                ) : (
                  <img
                    src={post.selectedFile}
                    alt="Post"
                    onLoad={() => setImageLoaded(true)}
                    style={{
                      width: '100%',
                      height: 280,
                      objectFit: 'cover',
                      borderTopLeftRadius: 24,
                      borderTopRightRadius: 24,
                      transition: 'transform 0.4s ease',
                    }}
                  />
                )}
              </Box>
            </Fade>
            
           
            {!imageLoaded && !isVideo && (
              <Box
                sx={{
                  width: '100%',
                  height: 280,
                  background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                }}
              >
                <Typography variant="body2" color="rgba(255,255,255,0.5)">
                  Loading...
                </Typography>
              </Box>
            )}
          </Box>

         
          <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
           
            <Slide direction="up" in={isVisible} timeout={800} style={{ transitionDelay: '400ms' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'linear-gradient(45deg, #6b21a8, #8b5cf6)',
                      width: 45,
                      height: 45,
                      border: '2px solid rgba(255,255,255,0.2)',
                      animation: `${glowPulse} 4s ease-in-out infinite`,
                    }}
                  >
                    <FaUser />
                  </Avatar>
                  <Box>
                   
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #ffffff, #e0e0ff)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                      
                    >
                  <div onClick={() =>{setProfile(post.creator);profileHandler(post.creator)}}>
                   {post.name}
                    </div>
                     
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {getTimeAgo(post.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                
                {isOwner && (
                  <Zoom in={isVisible} timeout={800} style={{ transitionDelay: '600ms' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={editHandler}
                      sx={{
                        borderRadius: '12px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#8b5cf6',
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                        fontSize: 11,
                        textTransform: 'none',
                        py: 0.5,
                        px: 1.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(139, 92, 246, 0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                        },
                      }}
                      startIcon={<FaEdit size={10} />}
                    >
                      Edit
                    </Button>
                  </Zoom>
                )}
              </Box>
            </Slide>

         
            <Slide direction="up" in={isVisible} timeout={800} style={{ transitionDelay: '500ms' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  mb: 1.5,
                  background: 'linear-gradient(45deg, #ffffff, #e0e0ff)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.3,
                }}
              >
                {post.title}
              </Typography>
            </Slide>

            
            <Slide direction="up" in={isVisible} timeout={800} style={{ transitionDelay: '600ms' }}>
              <Typography
                variant="body2"
                sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  mb: 2.5, 
                  lineHeight: 1.6,
                  fontSize: '0.9rem',
                }}
              >
                {post.description}
              </Typography>
            </Slide>

           
            <Slide direction="up" in={isVisible} timeout={800} style={{ transitionDelay: '700ms' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {post.tags.map((tag, i) => (
                  <Zoom 
                    key={i} 
                    in={isVisible} 
                    timeout={600} 
                    style={{ transitionDelay: `${800 + i * 100}ms` }}
                  >
                    <Chip
                      label={`#${tag}`}
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: '12px',
                        px: 1,
                        fontSize: '0.75rem',
                        animation: `${tagFloat} ${3 + i * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1) translateY(-2px)',
                          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                        },
                      }}
                    />
                  </Zoom>
                ))}
              </Box>
            </Slide>

            <Slide direction="up" in={isVisible} timeout={800} style={{ transitionDelay: '800ms' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pt: 2,
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                
                {user?.result ? (
                  <Button
                    onClick={handleLike}
                    startIcon={
                      <Box sx={{ animation: isLiked ? `${heartPulse} 0.6s ease` : 'none' }}>
                        {isLiked ? <FaHeart /> : <FaThumbsUp />}
                      </Box>
                    }
                    sx={{
                      background: isLiked
                        ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                        : 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'white',
                      borderRadius: '15px',
                      px: 2.5,
                      py: 1,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: isLiked
                          ? 'linear-gradient(135deg, #b91c1c, #dc2626)'
                          : 'rgba(255,255,255,0.2)',
                        transform: 'translateY(-3px) scale(1.05)',
                        boxShadow: isLiked 
                          ? '0 8px 25px rgba(220, 38, 38, 0.4)'
                          : '0 8px 25px rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
                  </Button>
                ) : (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <FaHeart />
                    {post.likes?.length || 0} Likes
                  </Typography>
                )}

             
                {isOwner && (
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    startIcon={<FaTrash />}
                    sx={{
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '15px',
                      px: 2.5,
                      py: 1,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'rgba(239, 68, 68, 0.1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                        color: 'white',
                        transform: 'translateY(-3px) scale(1.05)',
                        boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
                      },
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            </Slide>
          </Box>
        </Paper>
      </Zoom>

     
      <Dialog 
        open={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(31, 41, 55, 0.95))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #ef4444, #dc2626)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Delete Post
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Are you sure you want to delete this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setShowDeleteConfirm(false)}
            sx={{
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              px: 3,
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #dc2626, #ef4444)',
              borderRadius: '12px',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(220, 38, 38, 0.4)',
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Post;