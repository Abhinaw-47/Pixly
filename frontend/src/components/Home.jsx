import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Button,
  Modal,
  Paper,
  Typography,
  Avatar,
  Card,
  CardContent,
  Switch,
  Divider,
  Badge,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Fade,
  Slide,
  Zoom,
  Autocomplete,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { 
  FaSearch, 
  FaComments, 
  FaUpload, 
  FaUser, 
  FaHeart, 
  FaShare, 
  FaBookmark,
  FaUsers,
  FaGlobe,
  FaMoon,
  FaSun,
  FaRocket,
  FaCamera,
  FaVideo,
  FaEllipsisH,
  FaPaperPlane,
  FaGithub,
  FaTwitter,
  FaLinkedin
} from 'react-icons/fa';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import { keyframes } from '@mui/system';
import Pagination from './Pagination';
import Form from './Form';
import Posts from './Posts/Posts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPostsBySearch } from '../actions/post';
import { connectSocket, disconnectSocket } from '../api';
import { fetchUsers } from '../actions/message';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


const floatSocial = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotateZ(0deg);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-20px) rotateZ(180deg);
    opacity: 1;
  }
`;

const slideInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulseOnline = keyframes`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  50% { 
    transform: scale(1.2);
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
`;

const parallaxFloat = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  25% { transform: translateY(-15px) translateX(10px) rotate(90deg); }
  50% { transform: translateY(-8px) translateX(-10px) rotate(180deg); }
  75% { transform: translateY(-20px) translateX(5px) rotate(270deg); }
`;


const FloatingElements = ({ isDark }) => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 0,
      pointerEvents: 'none',
    }}
  >
    {[FaHeart, FaShare, FaComments, FaCamera, FaVideo].map((Icon, i) => (
      <Icon
        key={i}
        size={20 + Math.random() * 10}
        color={isDark ? `rgba(139, 92, 246, ${0.1 + Math.random() * 0.2})` : `rgba(59, 130, 246, ${0.1 + Math.random() * 0.2})`}
        style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `${parallaxFloat} ${10 + i * 2}s linear infinite`,
          animationDelay: `${i * 2}s`,
        }}
      />
    ))}
  </Box>
);

const Home = ({ showForm, setShowForm }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [currentId, setCurrentId] = useState(0);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const [search, setSearch] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { users } = useSelector((state) => state.message || { users: [] });
  const { onlineUsers } = useSelector((state) => state.auth || { onlineUsers: [] });
  const { messages } = useSelector((state) => state.message || { messages: [] });
  
  const query = useQuery();

  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');
  const navigate = useNavigate();
  const location = useLocation();

 
  const getRecentMessages = () => {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return [];
    }


    const messagesByUser = {};
    messages.forEach(msg => {
      const otherUserId = msg.senderId === user?.result?._id ? msg.receiverId : msg.senderId;
      const otherUser = users?.find(u => u._id === otherUserId);
      
      if (otherUser && (!messagesByUser[otherUserId] || new Date(msg.createdAt) > new Date(messagesByUser[otherUserId].createdAt))) {
        messagesByUser[otherUserId] = {
          ...msg,
          userName: otherUser.name,
          userId: otherUserId
        };
      }
    });

   
    return Object.values(messagesByUser)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(msg => ({
        user: msg.userName,
        message: msg.text || 'Image/Video',
        time: getTimeAgo(msg.createdAt),
        unread: 0, 
        userId: msg.userId
      }));
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const recentMessages = getRecentMessages();

  useEffect(() => {
    setMounted(true);
    if (searchQuery) {
      dispatch(getPostsBySearch({ search: searchQuery }));
    }
  }, [dispatch, searchQuery]);
  useEffect(() => {
  const currUser = JSON.parse(localStorage.getItem('profile'));
  setUser(currUser);
  
  if (currUser) {
    // Connect socket only if user exists and socket is not already connected
    const socket = connectSocket();
    if (socket) {
      console.log('Socket connected in Home component');
      
      // Set up listeners for online users
      const handleOnlineUsers = (userIds) => {
        dispatch({ type: 'SET_ONLINE_USERS', payload: userIds || [] });
      };

      // const handleUserConnected = (userId) => {
      //   dispatch({ type: 'ADD_ONLINE_USER', payload: userId });
      // };

      // const handleUserDisconnected = (userId) => {
      //   dispatch({ type: 'REMOVE_ONLINE_USER', payload: userId });
      // };

      // Add listeners
      socket.on('getOnlineUsers', handleOnlineUsers);
      // socket.on('userConnected', handleUserConnected);
      // socket.on('userDisconnected', handleUserDisconnected);

      // Fetch users
      dispatch(fetchUsers());

      // Cleanup function
      return () => {
        socket.off('getOnlineUsers', handleOnlineUsers);
        // socket.off('userConnected', handleUserConnected);
        // socket.off('userDisconnected', handleUserDisconnected);
      };
    }
  } else {
  
    disconnectSocket();
   

  }
}, [location.pathname, dispatch]);

  // useEffect(() => {
  //   const currUser = JSON.parse(localStorage.getItem('profile'));
  //   setUser(currUser);
    
  //   if (currUser) {
  //     connectSocket();
      
  //     dispatch(fetchUsers());
  //   } else {
  //     disconnectSocket();
  //   }
  // }, [location, dispatch]);

 
  // useEffect(() => {
  //   if (user) {
  //     dispatch(fetchUsers());
  //   }
  // }, [user, dispatch]);

  const handleSearch = () => {
    if (search.trim()) {
      dispatch(getPostsBySearch({ search }));
      navigate(`/posts/search?searchQuery=${search}`);
    } else {
      navigate('/');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLogout = () => {
    try {
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('profile');
      setUser(null);
      disconnectSocket();
     
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: [] });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeColors = {
    bg: isDarkMode 
      ? 'linear-gradient(135deg, #000000 0%, #1a0033 25%, #2a003f 50%, #1a0033 75%, #000000 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)',
    sidebarBg: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.95)',
    cardBg: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
    text: isDarkMode ? '#ffffff' : '#1e293b',
    textMuted: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(30, 41, 59, 0.7)',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 41, 59, 0.1)',
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: themeColors.bg,
        color: themeColors.text,
        display: 'flex',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      <FloatingElements isDark={isDarkMode} />

   
      {isSmallScreen && user && (
        <Box
          sx={{
            position: 'fixed',
            top: 88,
            left: 0,
            right: 0,
            background: themeColors.sidebarBg,
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${themeColors.border}`,
            px: 2,
            py: 2,
            zIndex: 100,
            animation: `${slideInFromLeft} 0.6s ease-out`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflowX: 'auto' }}>
          
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 'fit-content' }}>
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  background: 'linear-gradient(45deg, #6b21a8, #8b5cf6)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}
              >
                {user?.result?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                  {user?.result?.name}
                </Typography>
                <Typography variant="caption" color={themeColors.textMuted} sx={{ fontSize: '0.7rem' }}>
                  Welcome back! 👋
                </Typography>
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: themeColors.border }} />

           
            <Box sx={{ display: 'flex', gap: 1.5, minWidth: 'fit-content' }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<FaUpload />}
                onClick={() => setShowForm(true)}
                sx={{
                  background: 'linear-gradient(45deg, #6b21a8, #8b5cf6)',
                  borderRadius: '20px',
                  px: 2,
                  py: 0.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  minWidth: 'auto',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 15px rgba(107, 33, 168, 0.4)',
                  },
                }}
              >
                Post
              </Button>

              <Button
                variant="contained"
                size="small"
                startIcon={<FaComments />}
                onClick={() => navigate('/chat')}
                sx={{
                  background: 'linear-gradient(45deg, #1d4ed8, #3b82f6)',
                  borderRadius: '20px',
                  px: 2,
                  py: 0.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  minWidth: 'auto',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 15px rgba(29, 78, 216, 0.4)',
                  },
                }}
              >
                Chat
              </Button>

              <IconButton
                size="small"
                onClick={handleLogout}
                sx={{
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    background: '#ef4444',
                    color: 'white',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <LogoutIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: themeColors.border }} />

           
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content' }}>
              <IconButton
                size="small"
                onClick={toggleTheme}
                sx={{
                  color: isDarkMode ? '#8b5cf6' : '#f59e0b',
                  background: themeColors.cardBg,
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                {isDarkMode ? <FaMoon size={14} /> : <FaSun size={14} />}
              </IconButton>
            </Box>
          </Box>
        </Box>
              )}

      {!isSmallScreen && (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            top: 88,
            width: '280px',
            height: 'calc(100vh - 88px)', 
            background: themeColors.sidebarBg,
            backdropFilter: 'blur(20px)',
            borderRight: `1px solid ${themeColors.border}`,
            p: 3,
            overflowY: 'auto',
            zIndex: 100,
            animation: `${slideInFromLeft} 0.8s ease-out`,
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { 
              background: 'rgba(139, 92, 246, 0.3)', 
              borderRadius: '10px' 
            },
          }}
        >
        
          {user && (
            <Fade in={mounted} timeout={800}>
              <Card
                sx={{
                  mb: 3,
                  background: themeColors.cardBg,
                  backdropFilter: 'blur(15px)',
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: '20px',
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                      background: 'linear-gradient(45deg, #6b21a8, #8b5cf6)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                    }}
                  >
                    {user?.result?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                    {user?.result?.name}
                  </Typography>
                  <Typography variant="body2" color={themeColors.textMuted}>
                    Welcome back! 👋
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          )}

          
          <Slide direction="right" in={mounted} timeout={800} style={{ transitionDelay: '200ms' }}>
            <Card
              sx={{
                mb: 3,
                background: themeColors.cardBg,
                backdropFilter: 'blur(15px)',
                border: `1px solid ${themeColors.border}`,
                borderRadius: '20px',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Quick Actions
                </Typography>

                {user ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<FaUpload />}
                      onClick={() => setShowForm(true)}
                      fullWidth
                      sx={{
                        background: 'linear-gradient(45deg, #6b21a8, #8b5cf6)',
                        borderRadius: '12px',
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(107, 33, 168, 0.4)',
                        },
                      }}
                    >
                      Create Post
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<FaComments />}
                      onClick={() => navigate('/chat')}
                      fullWidth
                      sx={{
                        background: 'linear-gradient(45deg, #1d4ed8, #3b82f6)',
                        borderRadius: '12px',
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(29, 78, 216, 0.4)',
                        },
                      }}
                    >
                      Messages
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<LogoutIcon />}
                      onClick={handleLogout}
                      fullWidth
                      sx={{
                        borderColor: '#ef4444',
                        color: '#ef4444',
                        borderRadius: '12px',
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          background: '#ef4444',
                          color: 'white',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Sign Out
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => navigate('/auth')}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                      borderRadius: '12px',
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign In to Connect
                  </Button>
                )}
              </CardContent>
            </Card>
          </Slide>

        
          <Slide direction="right" in={mounted} timeout={800} style={{ transitionDelay: '400ms' }}>
            <Card
              sx={{
                background: themeColors.cardBg,
                backdropFilter: 'blur(15px)',
                border: `1px solid ${themeColors.border}`,
                borderRadius: '20px',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isDarkMode ? <FaMoon color="#8b5cf6" /> : <FaSun color="#f59e0b" />}
                    <Typography variant="body1" fontWeight={600}>
                      {isDarkMode ? 'Dark' : 'Light'} Mode
                    </Typography>
                  </Box>
                  <Switch
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    sx={{
                      '& .MuiSwitch-thumb': {
                        background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Slide>
        </Box>
      )}

  
      <Box
        sx={{
          flex: 1,
          ml: isSmallScreen ? 0 : '280px',
          mr: isSmallScreen ? 0 : '320px',
          pt: 3,
          pb: 3, 
          px: 3,
          overflowY: 'auto',
          height: 'calc(100vh - 88px)',
        }}
      >
       
        {isSmallScreen && !user && (
          <Box
            sx={{
              position: 'fixed',
              top: 88,
              left: 0,
              right: 0,
              background: themeColors.sidebarBg,
              backdropFilter: 'blur(20px)',
              borderBottom: `1px solid ${themeColors.border}`,
              px: 2,
              py: 2,
              zIndex: 100,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate('/auth')}
              sx={{
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                borderRadius: '20px',
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Sign In to Connect
            </Button>
          </Box>
        )}

        
        <Zoom in={mounted} timeout={1000} style={{ transitionDelay: '300ms' }}>
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              background: themeColors.cardBg,
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: `1px solid ${themeColors.border}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <TextField
              fullWidth
              placeholder="Search posts, topics, or people..."
              variant="standard"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                disableUnderline: true,
                sx: { 
                  color: themeColors.text,
                  fontSize: '1rem',
                  px: 3,
                  py: 2,
                },
                endAdornment: (
                  <IconButton onClick={handleSearch} sx={{ mr: 1 }}>
                    <FaSearch color={isDarkMode ? 'white' : '#1e293b'} />
                  </IconButton>
                ),
              }}
            />
          </Paper>
        </Zoom>

      
        <Slide direction="up" in={mounted} timeout={1000} style={{ transitionDelay: '500ms' }}>
          <Box>
            <Posts setCurrentId={setCurrentId} setShowForm={setShowForm} />
            {(!searchQuery) && (
                    <div className="max-w-2xl mx-auto -mt-8 pb-16 px-6">
       <div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4, delay: 0.2 }}
         className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 shadow-lg flex justify-center"
       >
         <Pagination page={page} />
       </div>
     </div>
               )}
            <Box
              sx={{
                mt: 6,
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(26, 0, 51, 0.8))'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${themeColors.border}`,
                borderRadius: '20px',
                p: 4,
                mx: 1,
              }}
            >
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 4,
                }}
              >
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '15px',
                      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: `${floatSocial} 4s ease-in-out infinite`,
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <FaRocket size={28} color="white" />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                      }}
                    >
                      CONNECTIFY
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color={themeColors.textMuted}
                      sx={{ maxWidth: { xs: '100%', md: 400 }, lineHeight: 1.6 }}
                    >
                      Connecting minds, sharing ideas, building communities together. 
                      A platform where creativity meets collaboration.
                    </Typography>
                  </Box>
                </Box>

              
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 250 }}>
                  <Typography 
                    variant="h6" 
                    color={themeColors.text}
                    sx={{ fontWeight: 700, textAlign: { xs: 'center', md: 'left' } }}
                  >
                    Connect with our Team
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box 
                      component="a"
                      href="https://github.com/connectify-team"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: '12px',
                        background: themeColors.cardBg,
                        border: `1px solid ${themeColors.border}`,
                        textDecoration: 'none',
                        color: themeColors.text,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: '#333333',
                          color: '#ffffff',
                          transform: 'translateX(5px)',
                          boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      <FaGithub size={20} />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          GitHub
                        </Typography>
                        <Typography variant="caption" color={themeColors.textMuted}>
                          @connectify-team
                        </Typography>
                      </Box>
                    </Box>

                    <Box 
                      component="a"
                      href="https://linkedin.com/company/connectify"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: '12px',
                        background: themeColors.cardBg,
                        border: `1px solid ${themeColors.border}`,
                        textDecoration: 'none',
                        color: themeColors.text,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: '#0077b5',
                          color: '#ffffff',
                          transform: 'translateX(5px)',
                          boxShadow: '0 5px 20px rgba(0, 119, 181, 0.3)',
                        },
                      }}
                    >
                      <FaLinkedin size={20} />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          LinkedIn
                        </Typography>
                        <Typography variant="caption" color={themeColors.textMuted}>
                          /company/connectify
                        </Typography>
                      </Box>
                    </Box>

                    <Box 
                      component="a"
                      href="https://twitter.com/connectify_app"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: '12px',
                        background: themeColors.cardBg,
                        border: `1px solid ${themeColors.border}`,
                        textDecoration: 'none',
                        color: themeColors.text,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: '#1da1f2',
                          color: '#ffffff',
                          transform: 'translateX(5px)',
                          boxShadow: '0 5px 20px rgba(29, 161, 242, 0.3)',
                        },
                      }}
                    >
                      <FaTwitter size={20} />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          Twitter
                        </Typography>
                        <Typography variant="caption" color={themeColors.textMuted}>
                          @connectify_app
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

          
              <Box 
                sx={{ 
                  borderTop: `1px solid ${themeColors.border}`,
                  pt: 3, 
                  mt: 4, 
                  textAlign: 'center' 
                }}
              >
                <Typography 
                  variant="body2" 
                  color={themeColors.textMuted}
                  sx={{ fontSize: '0.9rem', fontWeight: 500 }}
                >
                  © 2025 CONNECTIFY • Made with ❤️ by our amazing development team
                </Typography>
              </Box>
            </Box>
          </Box>
        </Slide>
      </Box>

      
      {!isSmallScreen && (
        <Box
          sx={{
            position: 'fixed',
            right: 0,
            top: 88,
            width: '320px',
            height: 'calc(100vh - 88px)',
            background: themeColors.sidebarBg,
            backdropFilter: 'blur(20px)',
            borderLeft: `1px solid ${themeColors.border}`,
            p: 3,
            overflowY: 'auto',
            zIndex: 100,
            animation: `${slideInFromRight} 0.8s ease-out`,
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { 
              background: 'rgba(139, 92, 246, 0.3)', 
              borderRadius: '10px' 
            },
          }}
        >
        
          <Slide direction="left" in={mounted} timeout={800} style={{ transitionDelay: '600ms' }}>
            <Card
              sx={{
                mb: 3,
                background: themeColors.cardBg,
                backdropFilter: 'blur(15px)',
                border: `1px solid ${themeColors.border}`,
                borderRadius: '20px',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FaUsers color="#22c55e" />
                  <Typography variant="h6" fontWeight={700}>
                    {user ? 'Friends Online' : 'Join the Community'}
                  </Typography>
                  {user && users && (
                    <Chip 
                      label={onlineUsers?.length || 0} 
                      size="small"
                      sx={{ 
                        background: '#22c55e', 
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>

                {user ? (
                  users && users.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {users.slice(0, 4).map((friend, index) => (
                        <ListItem
                          key={friend._id}
                          sx={{
                            px: 0,
                            py: 1,
                            cursor: 'pointer',
                            borderRadius: '12px',
                            '&:hover': {
                              background: 'rgba(59, 130, 246, 0.1)',
                            },
                          }}
                          onClick={() => {
                            
                            dispatch({ type: 'SELECT_USER', payload: friend });
                            navigate('/chat');
                          }}
                        >
                          <ListItemAvatar>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                onlineUsers?.includes(friend._id) ? (
                                  <Box
                                    sx={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: '50%',
                                      bgcolor: '#22c55e',
                                      border: '2px solid white',
                                      animation: `${pulseOnline} 2s infinite`,
                                    }}
                                  />
                                ) : null
                              }
                            >
                              <Avatar
                                sx={{
                                  background: `linear-gradient(45deg, 
                                    hsl(${index * 60}, 70%, 60%), 
                                    hsl(${index * 60 + 60}, 70%, 70%)
                                  )`,
                                  width: 35,
                                  height: 35,
                                }}
                              >
                                {friend.name?.charAt(0).toUpperCase()}
                              </Avatar>
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText
                            primary={friend.name}
                            secondary={
                              onlineUsers?.includes(friend._id) ? 
                              'Online' : 'Offline'
                            }
                            primaryTypographyProps={{ 
                              fontWeight: 600,
                              fontSize: '0.9rem',
                            }}
                            secondaryTypographyProps={{ 
                              color: onlineUsers?.includes(friend._id) ? '#22c55e' : themeColors.textMuted,
                              fontSize: '0.75rem',
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color={themeColors.textMuted} sx={{ textAlign: 'center', py: 2 }}>
                      No friends online right now
                    </Typography>
                  )
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <FaGlobe size={35} color="#8b5cf6" style={{ marginBottom: 16 }} />
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                      Connect with Amazing People!
                    </Typography>
                    <Typography variant="body2" color={themeColors.textMuted} sx={{ mb: 3 }}>
                      Join CONNECTIFY to see who's online and start meaningful conversations.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/auth')}
                      sx={{
                        background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                        borderRadius: '12px',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Join Now
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Slide>

      
          {user && (
            <Slide direction="left" in={mounted} timeout={800} style={{ transitionDelay: '800ms' }}>
              <Card
                sx={{
                  background: themeColors.cardBg,
                  backdropFilter: 'blur(15px)',
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: '20px',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaComments color="#3b82f6" />
                      <Typography variant="h6" fontWeight={700}>
                        Recent Messages
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small"
                      onClick={() => navigate('/chat')}
                      sx={{ 
                        color: themeColors.textMuted,
                        '&:hover': { color: '#3b82f6' },
                      }}
                    >
                      <FaEllipsisH />
                    </IconButton>
                  </Box>

                  <List sx={{ p: 0 }}>
                    {recentMessages.length > 0 ? recentMessages.map((msg, index) => (
                      <ListItem
                        key={msg.userId || index}
                        sx={{
                          px: 0,
                          py: 1.5,
                          cursor: 'pointer',
                          borderRadius: '12px',
                          '&:hover': {
                            background: 'rgba(59, 130, 246, 0.1)',
                          },
                        }}
                        onClick={() => {
                          
                          const selectedUser = users?.find(u => u._id === msg.userId);
                          if (selectedUser) {
                            dispatch({ type: 'SELECT_USER', payload: selectedUser });
                          }
                          navigate('/chat');
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            badgeContent={msg.unread > 0 ? msg.unread : null}
                            color="error"
                            sx={{
                              '& .MuiBadge-badge': {
                                fontSize: '0.7rem',
                                minWidth: '18px',
                                height: '18px',
                              },
                            }}
                          >
                            <Avatar
                              sx={{
                                background: `linear-gradient(45deg, 
                                  hsl(${index * 80}, 65%, 55%), 
                                  hsl(${index * 80 + 80}, 65%, 65%)
                                )`,
                                width: 35,
                                height: 35,
                              }}
                            >
                              {msg.user.charAt(0).toUpperCase()}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={msg.user}
                          secondary={msg.message}
                          primaryTypographyProps={{ 
                            fontWeight: 600,
                            fontSize: '0.85rem',
                          }}
                          secondaryTypographyProps={{ 
                            color: themeColors.textMuted,
                            fontSize: '0.75rem',
                            noWrap: true,
                          }}
                        />
                        <Typography 
                          variant="caption" 
                          color={themeColors.textMuted}
                          sx={{ ml: 1, fontSize: '0.7rem' }}
                        >
                          {msg.time}
                        </Typography>
                      </ListItem>
                    )) : (
                      <Box sx={{ textAlign: 'center', py: 3 }}>
                        <FaComments size={30} color="#8b5cf6" style={{ marginBottom: 12 }} />
                        <Typography variant="body2" color={themeColors.textMuted}>
                          No recent messages
                        </Typography>
                        <Typography variant="caption" color={themeColors.textMuted}>
                          Start a conversation!
                        </Typography>
                      </Box>
                    )}
                  </List>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/chat')}
                    sx={{
                      mt: 2,
                      borderColor: '#3b82f6',
                      color: '#3b82f6',
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        background: '#3b82f6',
                        color: 'white',
                      },
                    }}
                  >
                    View All Messages
                  </Button>
                </CardContent>
              </Card>
            </Slide>
          )}
        </Box>
      )}

  
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        closeAfterTransition
        sx={{ zIndex: 1300 }}
      >
        <Fade in={showForm} timeout={500}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: 600,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <Paper
              sx={{
                borderRadius: '30px',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(31, 41, 55, 0.95))',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
              }}
            >
              <IconButton
                onClick={() => setShowForm(false)}
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  color: 'white',
                  zIndex: 1,
                }}
              >
                <CloseIcon />
              </IconButton>
              <Form
                currentId={currentId}
                setCurrentId={setCurrentId}
                setShowForm={setShowForm}
              />
            </Paper>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Home;