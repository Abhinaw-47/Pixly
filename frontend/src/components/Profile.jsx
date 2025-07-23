import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  Container,
  Fade,
  Zoom,
  Slide,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Switch,
  Chip,
} from '@mui/material';
import { 
  FaUser, 
  FaUsers, 
  FaCalendarAlt, 
  FaHeart,
  FaShare,
  FaBookmark,
  FaArrowLeft,
  FaRocket,
  FaComments,
  FaGlobe,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaUpload,
  FaMoon,
  FaSun,
  FaUserNinja,
  FaUserAstronaut,
  FaUserSecret,
  FaRobot,
  FaDragon,
  FaCat,
  FaDog,
  FaPaw,
  FaEllipsisH,
  FaPaperPlane,
  FaUserPlus
} from 'react-icons/fa';
import LogoutIcon from '@mui/icons-material/Logout';
import { keyframes } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getProfile } from '../actions/post';
import { fetchUsers } from '../actions/message';
import { connectSocket } from '../api';
import Post from './Posts/post/Post';

// Enhanced animations
const float3D = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotateX(0deg) rotateY(0deg);
    box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);
  }
  25% { 
    transform: translateY(-8px) rotateX(3deg) rotateY(2deg);
    box-shadow: 0 30px 80px rgba(139, 92, 246, 0.4);
  }
  50% { 
    transform: translateY(-4px) rotateX(-2deg) rotateY(-2deg);
    box-shadow: 0 15px 50px rgba(139, 92, 246, 0.35);
  }
  75% { 
    transform: translateY(-12px) rotateX(2deg) rotateY(3deg);
    box-shadow: 0 35px 90px rgba(139, 92, 246, 0.45);
  }
`;

const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.4),
                0 0 60px rgba(59, 130, 246, 0.2),
                inset 0 0 30px rgba(139, 92, 246, 0.1);
  }
  50% { 
    box-shadow: 0 0 50px rgba(139, 92, 246, 0.6),
                0 0 100px rgba(59, 130, 246, 0.4),
                inset 0 0 50px rgba(139, 92, 246, 0.2);
  }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const parallaxFloat = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  25% { transform: translateY(-15px) translateX(10px) rotate(90deg); }
  50% { transform: translateY(-8px) translateX(-10px) rotate(180deg); }
  75% { transform: translateY(-20px) translateX(5px) rotate(270deg); }
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

const avatarBounce = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-10px) rotate(5deg) scale(1.05);
  }
  50% {
    transform: translateY(-5px) rotate(-3deg) scale(1.1);
  }
  75% {
    transform: translateY(-15px) rotate(2deg) scale(1.05);
  }
`;

const gradientShift = keyframes`
  0%, 100% {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  25% {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
  50% {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
  75% {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  }
`;

// Utility function - moved to the top
const getTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now - time) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  return `${Math.floor(diffInMinutes / 1440)}d`;
};

// Cartoon Avatar Component
const CartoonAvatar = ({ name, size = 120 }) => {
  const avatars = [
    { icon: FaUserNinja, color: '#8b5cf6', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { icon: FaUserAstronaut, color: '#3b82f6', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { icon: FaRobot, color: '#10b981', bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { icon: FaDragon, color: '#f59e0b', bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { icon: FaCat, color: '#ef4444', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { icon: FaUserSecret, color: '#6366f1', bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { icon: FaPaw, color: '#8b5cf6', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { icon: FaDog, color: '#f97316', bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  ];

  const getAvatarForName = (name) => {
    if (!name) return avatars[0];
    const index = name.charCodeAt(0) % avatars.length;
    return avatars[index];
  };

  const avatar = getAvatarForName(name);
  const IconComponent = avatar.icon;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: avatar.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '4px solid rgba(255, 255, 255, 0.2)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: avatar.bg,
          animation: `${gradientShift} 8s ease-in-out infinite`,
          borderRadius: '50%',
          zIndex: 1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '30%',
          height: '30%',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          filter: 'blur(8px)',
          zIndex: 2,
        },
      }}
    >
      <IconComponent 
        size={size * 0.6} 
        color="white" 
        style={{ 
          zIndex: 3, 
          position: 'relative',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        }} 
      />
    </Box>
  );
};

// Improved Profile Card Component
const ProfileCard = ({ profileData, themeColors }) => {
  const getTimeAgoForJoin = (timestamp) => {
    const now = new Date();
    const joinTime = new Date(timestamp);
    const diffInDays = Math.floor((now - joinTime) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'today';
    if (diffInDays === 1) return '1d ago';
    if (diffInDays < 30) return `${diffInDays}d ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
    return `${Math.floor(diffInDays / 365)}y ago`;
  };

  return (
    <Zoom in timeout={1000}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: '100%',
          mx: 'auto',
          mb: 4,
          borderRadius: '24px',
          background: themeColors.cardBg,
          backdropFilter: 'blur(25px)',
          border: `1px solid ${themeColors.border}`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box sx={{ p: 4 }}>
          {/* Profile Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <CartoonAvatar name={profileData?.name} size={100} />
            
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 0.5,
                  color: themeColors.text,
                }}
              >
                {profileData?.name || 'Loading...'}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: themeColors.textMuted,
                  fontWeight: 400,
                  mb: 2,
                }}
              >
                @{profileData?.username || 'username'}
              </Typography>

              {/* Stats Row */}
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: themeColors.text,
                      mb: 0.5,
                    }}
                  >
                    {profileData?.postCount || 0}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: themeColors.textMuted,
                      fontWeight: 500,
                    }}
                  >
                    Posts
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: themeColors.text,
                      mb: 0.5,
                    }}
                  >
                    {profileData?.friends || 0}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: themeColors.textMuted,
                      fontWeight: 500,
                    }}
                  >
                    Friends
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: themeColors.text,
                      mb: 0.5,
                    }}
                  >
                    {profileData?.joinedDate ? getTimeAgoForJoin(profileData.joinedDate) : 'Recently'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: themeColors.textMuted,
                      fontWeight: 500,
                    }}
                  >
                    Joined
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* User ID */}
          <Box
            sx={{
              textAlign: 'center',
              p: 2,
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: themeColors.textMuted,
                fontFamily: 'monospace',
                letterSpacing: 1,
              }}
            >
              ID: {profileData?.id?.slice(-8)?.toUpperCase() || 'USER0001'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Zoom>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { profile } = useParams();
  
  const { posts, isLoading } = useSelector((state) => state.post);
  const { users, isUserLoading } = useSelector((state) => state.message || { users: [], isUserLoading: false });
  const { onlineUsers } = useSelector((state) => state.auth || { onlineUsers: [] });
  const { messages } = useSelector((state) => state.message || { messages: [] });
  const [currentUser] = useState(() => JSON.parse(localStorage.getItem('profile')));
  const [mounted, setMounted] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Get recent messages function (moved before it's used)
  const getRecentMessages = () => {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return [];
    }

    const messagesByUser = {};
    messages.forEach(msg => {
      const otherUserId = msg.senderId === currentUser?.result?._id ? msg.receiverId : msg.senderId;
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

  useEffect(() => {
    setMounted(true);
    if (profile) {
      dispatch(getProfile({ profile: profile }));
    }
    
    // Fetch users only if logged in, as this is where the original problem stems from.
    // Anonymous users won't have the full `users` list.
    if (currentUser) {
      const socket = connectSocket();
      if (socket) {
        socket.on('getOnlineUsers', (UserIds) => {
          dispatch({ type: 'SET_ONLINE_USERS', payload: UserIds });
        });
        dispatch(fetchUsers());
      }
    }
  }, [dispatch, profile, currentUser]);


  // UPDATED LOGIC: This useEffect now correctly handles cases for both logged-in and anonymous users.
  useEffect(() => {
    // We wait until the posts for the profile have been loaded.
    if (posts && profile) {
      // For logged-in users, the `users` array will be populated.
      // For anonymous users, `users` will be empty.
      const targetUser = Array.isArray(users) ? users.find(u => u._id === profile) : null;
      
      // We can now reliably get the profile info.
      // 1. Try to get it from `targetUser` (if logged in and users are fetched).
      // 2. Fallback to the first post's data if `targetUser` is not found.
      // 3. Use a default 'Unknown' if there are no posts either.
      const userPosts = Array.isArray(posts) ? posts : [];
      const userName = targetUser?.name || (userPosts.length > 0 ? userPosts[0].name : 'Unknown User');
      const firstName = userName.split(' ')[0];
      const userId = profile || '';
      
      // Calculate friends count. If `targetUser` exists, use their friends. Otherwise, default to 0 for anonymous view.
      const friendsCount = targetUser?.friends?.length || 0;
      
      setProfileData({
        id: profile,
        name: userName,
        username: `${firstName.toLowerCase()}${userId.slice(0, 4)}`,
        postCount: userPosts.length,
        friends: friendsCount, // Use the calculated friends count
        joinedDate: targetUser?.createdAt || (userPosts.length > 0 ? userPosts[0].createdAt : new Date().toISOString()),
        avatar: userName.charAt(0).toUpperCase(),
        // A profile is valid if we found the user OR if they have posts.
        hasUser: !!targetUser || userPosts.length > 0,
      });
    }
  }, [posts, users, profile]);

  const recentMessages = getRecentMessages();

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

  const handleLogout = () => {
    try {
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('profile');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleProfileNavigation = (userId) => {
    navigate(`/posts/profile/${userId}`, { replace: true });
  };

  // The loading state now depends on `profileData` being set, not just `isLoading`.
  // This is because we need to wait for the profile data to be constructed.
  if (isLoading || !profileData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: themeColors.bg,
          color: themeColors.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: '30px',
            background: themeColors.cardBg,
            backdropFilter: 'blur(25px)',
            border: `1px solid ${themeColors.border}`,
            textAlign: 'center',
            animation: `${pulseGlow} 3s ease-in-out infinite`,
          }}
        >
          <CircularProgress 
            size={60}
            thickness={3}
            sx={{ 
              color: '#8b5cf6',
              mb: 3,
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Loading Profile...
          </Typography>
          <Typography variant="body1" color={themeColors.textMuted}>
            Please wait while we fetch the profile data
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Profile not found (no user info and no posts)
  if (!profileData?.hasUser) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: themeColors.bg,
          color: themeColors.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: '30px',
            background: themeColors.cardBg,
            backdropFilter: 'blur(25px)',
            border: `1px solid ${themeColors.border}`,
            textAlign: 'center',
          }}
        >
          <FaUser size={60} color="#8b5cf6" style={{ marginBottom: 24 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Profile Not Found
          </Typography>
          <Typography variant="body1" color={themeColors.textMuted} sx={{ mb: 3 }}>
            This user profile doesn't exist or has been removed.
          </Typography>
          <IconButton
            onClick={() => navigate('/', { replace: true })}
            sx={{
              color: themeColors.text,
              background: 'linear-gradient(45deg, #6b21a8, #8b5cf6)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
              },
            }}
          >
            <FaArrowLeft />
          </IconButton>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: themeColors.bg,
        color: themeColors.text,
        position: 'relative',
        display: 'flex',
      }}
    >
      {/* Enhanced 3D Background */}
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
        {[...Array(25)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              background: `radial-gradient(circle, 
                rgba(139, 92, 246, ${0.1 + Math.random() * 0.3}), 
                transparent 70%
              )`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `${parallaxFloat} ${6 + i * 2}s linear infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>

      {/* Left Sidebar - Same as Home.jsx */}
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
          {/* User Profile Section */}
          {currentUser && (
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
                    {currentUser?.result?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, color: themeColors.text }}>
                    {currentUser?.result?.name}
                  </Typography>
                  <Typography variant="body2" color={themeColors.textMuted}>
                    Welcome back! 👋
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          )}

          {/* Quick Actions */}
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
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: themeColors.text }}>
                  Quick Actions
                </Typography>

                {currentUser ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<FaUpload />}
                      onClick={() => navigate('/', { replace: true })}
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
                      onClick={() => navigate('/chat', { replace: true })}
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
                    onClick={() => navigate('/auth', { replace: true })}
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

          {/* Theme Toggle */}
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
                    <Typography variant="body1" fontWeight={600} sx={{ color: themeColors.text }}>
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

      {/* Right Sidebar - Same as Home.jsx */}
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
          {/* Friends Online */}
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
                  <Typography variant="h6" fontWeight={700} sx={{ color: themeColors.text }}>
                    {currentUser ? 'Friends Online' : 'Join the Community'}
                  </Typography>
                  {currentUser && users && (
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

                {currentUser ? (
                  users && users.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {users.filter(u => u._id !== profile).slice(0, 4).map((friend, index) => (
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
                          onClick={() => handleProfileNavigation(friend._id)}
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
                              color: themeColors.text,
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
                      No friends found
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
                      onClick={() => navigate('/auth', { replace: true })}
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

          {/* Recent Messages */}
          {currentUser && (
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
                      onClick={() => navigate('/chat', { replace: true })}
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
                          navigate('/chat', { replace: true });
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
                    onClick={() => navigate('/chat', { replace: true })}
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

      {/* Main Content */}
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
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Back Button */}
        <Zoom in={mounted} timeout={800}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              mb: 3,
              color: themeColors.text,
              background: themeColors.cardBg,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${themeColors.border}`,
              borderRadius: '15px',
              width: 50,
              height: 50,
              '&:hover': {
                background: 'rgba(139, 92, 246, 0.2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
              },
            }}
          >
            <FaArrowLeft />
          </IconButton>
        </Zoom>

        {/* Profile Card */}
        {profileData && (
          <ProfileCard 
            profileData={profileData} 
            themeColors={themeColors}
          />
        )}

        {/* Posts Section Header with Background */}
        <Box
          sx={{
            mb: 4,
            background: `linear-gradient(135deg, 
              ${isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)'}, 
              ${isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(139, 92, 246, 0.05)'}
            )`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${themeColors.border}`,
            borderRadius: '20px',
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Posts by {profileData?.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: themeColors.textMuted,
              fontWeight: 500,
            }}
          >
            {profileData?.postCount || 0} {profileData?.postCount === 1 ? 'post' : 'posts'} shared
          </Typography>
        </Box>

        {/* Posts Container with Border */}
        <Box
          sx={{
            background: themeColors.cardBg,
            backdropFilter: 'blur(20px)',
            border: `2px solid ${themeColors.border}`,
            borderRadius: '24px',
            p: 3,
            minHeight: '400px',
          }}
        >
          <Fade in={mounted} timeout={1000}>
            <Box>
              {/* Posts Grid - Instagram-like consistent sizing */}
              {Array.isArray(posts) && posts.length > 0 ? (
                <Grid container spacing={2} justifyContent="flex-start">
                  {posts.map((post, index) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={6} 
                      md={4}
                      key={post._id || index}
                    >
                      <Slide 
                        direction="up" 
                        in={mounted} 
                        timeout={800} 
                        style={{ 
                          transitionDelay: `${600 + index * 100}ms`,
                        }}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            '&:hover': {
                              '& .post-overlay': {
                                opacity: 1,
                              },
                              transform: 'translateY(-4px)',
                            },
                            transition: 'all 0.3s ease',
                            height: '100%',
                          }}
                        >
                          {/* Post Hover Overlay */}
                          <Box
                            className="post-overlay"
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: `
                                linear-gradient(
                                  135deg,
                                  rgba(139, 92, 246, 0.1),
                                  rgba(59, 130, 246, 0.1)
                                )
                              `,
                              borderRadius: '16px',
                              opacity: 0,
                              transition: 'opacity 0.3s ease',
                              pointerEvents: 'none',
                              zIndex: 1,
                            }}
                          />
                          
                          {/* Post Component with Fixed Height */}
                          <Box
                            sx={{
                              height: '100%',
                              minHeight: '350px',
                              '& > div': {
                                height: '100%',
                              },
                            }}
                          >
                            <Post 
                              post={post}
                              setCurrentId={() => {}}
                              setShowForm={() => {}}
                            />
                          </Box>
                        </Box>
                      </Slide>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                /* No Posts Message */
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                  }}
                >
                  <FaRocket size={80} color="#8b5cf6" style={{ marginBottom: 24 }} />
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: themeColors.text,
                    }}
                  >
                    No Posts Yet
                  </Typography>
                  <Typography
                    variant="h6"
                    color={themeColors.textMuted}
                    sx={{ mb: 3 }}
                  >
                    {profileData?.name} hasn't shared any posts yet.
                  </Typography>
                  
                  {/* Show different message if it's current user vs other user */}
                  {currentUser?.result?._id === profile ? (
                    <Button
                      variant="contained"
                      startIcon={<FaUpload />}
                      onClick={() => navigate('/', { replace: true })}
                      sx={{
                        background: 'linear-gradient(45deg, #6b21a8, #8b5cf6)',
                        borderRadius: '15px',
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(107, 33, 168, 0.4)',
                        },
                      }}
                    >
                      Create Your First Post
                    </Button>
                  ) : (
                    <Typography
                      variant="body1"
                      color={themeColors.textMuted}
                    >
                      Check back later for updates!
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;