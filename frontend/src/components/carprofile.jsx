// import React, { useState, useEffect, Fragment } from 'react';
// import {
//   Box,
//   Typography,
//   Avatar,
//   Grid,
//   CircularProgress,
//   IconButton,
//   Button,
//   useMediaQuery,
//   useTheme,
//   Switch,
//   Badge,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
// } from '@mui/material';
// import {
//   FaUser,
//   FaUsers,
//   FaArrowLeft,
//   FaRocket,
//   FaPalette,
//   FaChartLine,
//   FaMoon,
//   FaSun,
//   FaSignOutAlt,
//   FaUserPlus,
//   FaEnvelope,
// } from 'react-icons/fa';
// import { keyframes } from '@mui/system';
// // NEW: Import framer-motion and new libraries
// import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
// import Masonry from 'react-masonry-css';
// import { Tab } from '@headlessui/react'; // For accessible tabs

// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getProfile } from '../actions/post';
// import { fetchUsers } from '../actions/message';
// import { connectSocket } from '../api';
// import Post from './Posts/post/Post'; // Your existing Post component

// // --- Keyframes & Animation Variants ---
// const pulseOnline = keyframes`
//   0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
//   70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
//   100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
// `;

// const pageVariants = {
//   initial: { opacity: 0 },
//   in: { opacity: 1, transition: { duration: 0.8 } },
//   out: { opacity: 0, transition: { duration: 0.3 } },
// };

// const tabContentVariants = {
//   initial: { opacity: 0, y: 20 },
//   enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
//   exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
// };

// // --- Child Components for the New Layout ---

// const getTimeAgoForJoin = (timestamp) => {
//     const now = new Date();
//     const joinTime = new Date(timestamp);
//     const diffInDays = Math.floor((now - joinTime) / (1000 * 60 * 60 * 24));
//     if (diffInDays === 0) return 'today';
//     if (diffInDays < 30) return `${diffInDays}d`;
//     if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo`;
//     return `${Math.floor(diffInDays / 365)}y`;
// };

// // NEW: The Interactive Profile Header
// const ProfileHeader = ({ profileData, themeColors, onThemeToggle, isDarkMode, onLogout }) => {
//   const navigate = useNavigate();
//   // Parallax effect for the header background
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const rotateX = useTransform(y, [-100, 100], [10, -10]);
//   const rotateY = useTransform(x, [-100, 100], [-10, 10]);

//   return (
//     <Box
//       onMouseMove={(e) => {
//         const rect = e.currentTarget.getBoundingClientRect();
//         x.set(e.clientX - rect.left - rect.width / 2);
//         y.set(e.clientY - rect.top - rect.height / 2);
//       }}
//       onMouseLeave={() => {
//         x.set(0);
//         y.set(0);
//       }}
//       sx={{
//         borderRadius: '24px',
//         p: 4,
//         position: 'relative',
//         overflow: 'hidden',
//         border: `1px solid ${themeColors.border}`,
//         perspective: '1000px',
//       }}
//     >
//       <motion.div
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: themeColors.cardBg,
//           backdropFilter: 'blur(20px)',
//           rotateX,
//           rotateY,
//         }}
//       />
//       <Box sx={{ position: 'relative', zIndex: 2 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
//            <IconButton onClick={() => navigate(-1)} sx={{ color: themeColors.text, background: 'rgba(0,0,0,0.1)', '&:hover': { background: 'rgba(0,0,0,0.2)' } }}>
//              <FaArrowLeft />
//            </IconButton>
//            {/* NEW: User Actions Dropdown (replaces left sidebar) */}
//            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, background: 'rgba(0,0,0,0.1)', borderRadius: '16px' }}>
//                 <IconButton onClick={onThemeToggle} size="small">
//                     {isDarkMode ? <FaSun color="#fbbf24" /> : <FaMoon color="#a78bfa" />}
//                 </IconButton>
//                 <IconButton onClick={onLogout} size="small">
//                     <FaSignOutAlt color="#f87171" />
//                 </IconButton>
//            </Box>
//         </Box>
        
//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
//           <Avatar sx={{ width: 120, height: 120, mb: 2, background: themeColors.primaryGradient, fontSize: '3rem' }}>
//             {profileData?.name?.charAt(0)}
//           </Avatar>
//           <Typography variant="h3" fontWeight={800} color={themeColors.text}>
//             {profileData?.name}
//           </Typography>
//           <Typography variant="h6" color={themeColors.textMuted} mb={3}>
//             @{profileData?.username}
//           </Typography>

//           <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '500px', mb: 3 }}>
//             <Grid item xs={4}>
//               <Typography variant="h5" fontWeight={700} color={themeColors.text}>{profileData?.postCount || 0}</Typography>
//               <Typography variant="body2" color={themeColors.textMuted}>Creations</Typography>
//             </Grid>
//             <Grid item xs={4}>
//               <Typography variant="h5" fontWeight={700} color={themeColors.text}>{profileData?.friends || 0}</Typography>
//               <Typography variant="body2" color={themeColors.textMuted}>Friends</Typography>
//             </Grid>
//             <Grid item xs={4}>
//               <Typography variant="h5" fontWeight={700} color={themeColors.text}>{getTimeAgoForJoin(profileData.joinedDate)}</Typography>
//               <Typography variant="body2" color={themeColors.textMuted}>Joined</Typography>
//             </Grid>
//           </Grid>

//           <Box sx={{ display: 'flex', gap: 2 }}>
//              <Button variant="contained" startIcon={<FaUserPlus />} sx={{ background: themeColors.primaryGradient, borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}>Follow</Button>
//              <Button variant="outlined" startIcon={<FaEnvelope />} sx={{ borderColor: themeColors.border, color: themeColors.text, borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}>Message</Button>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };


// // --- Main Profile Component ---
// const Profile = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { profile } = useParams();

//   // State management
//   const { posts, isLoading } = useSelector((state) => state.post);
//   const { users, isUserLoading } = useSelector((state) => state.message || { users: [], isUserLoading: false });
//   const { onlineUsers } = useSelector((state) => state.auth || { onlineUsers: [] });
//   const [currentUser] = useState(() => JSON.parse(localStorage.getItem('profile')));
//   const [profileData, setProfileData] = useState(null);
//   const [isDarkMode, setIsDarkMode] = useState(true);

//   // Theme colors
//   const themeColors = {
//     bg: isDarkMode ? '#111827' : '#F3F4F6',
//     cardBg: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.7)',
//     text: isDarkMode ? '#F9FAFB' : '#1F2937',
//     textMuted: isDarkMode ? '#9CA3AF' : '#4B5563',
//     border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
//     primaryGradient: 'linear-gradient(to right, #8B5CF6, #EC4899)',
//     tabActive: isDarkMode ? '#EC4899' : '#8B5CF6',
//     tabInactive: isDarkMode ? '#9CA3AF' : '#6B7280',
//   };

//   useEffect(() => {
//     if (profile) dispatch(getProfile({ profile }));
//     dispatch(fetchUsers());
//   }, [dispatch, profile]);

//   useEffect(() => {
//     if (users && profile) {
//       const targetUser = users.find(u => u._id === profile);
//       const userPosts = Array.isArray(posts) ? posts : [];
//       const userName = targetUser?.name || (userPosts.length > 0 ? userPosts[0].name : 'Unknown User');
      
//       setProfileData({
//         id: profile,
//         name: userName,
//         username: `${userName.split(' ')[0].toLowerCase()}${profile.slice(0, 4)}`,
//         postCount: userPosts.length,
//         friends: users.filter(u => u._id !== profile).length,
//         joinedDate: targetUser?.createdAt || new Date().toISOString(),
//         hasUser: !!targetUser || userPosts.length > 0,
//       });
//     }
//   }, [posts, users, profile]);

//   const handleLogout = () => {
//     dispatch({ type: 'LOGOUT' });
//     localStorage.removeItem('profile');
//     navigate('/');
//   };

//   const masonryBreakpoints = {
//     default: 3,
//     1100: 2,
//     700: 1,
//   };

//   if (isLoading || isUserLoading || !profileData) {
//     return (
//       <Box sx={{ minHeight: '100vh', background: themeColors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <CircularProgress sx={{ color: themeColors.tabActive }}/>
//       </Box>
//     );
//   }

//   if (!profileData.hasUser) {
//      return (
//         <Box sx={{ minHeight: '100vh', background: themeColors.bg, color: themeColors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 2 }}>
//             <Box>
//                 <FaUser size={60} color="#8b5cf6" style={{ marginBottom: 24 }} />
//                 <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Profile Not Found</Typography>
//                 <Typography color={themeColors.textMuted} sx={{ mb: 3 }}>This user profile doesn't exist or has been removed.</Typography>
//                 <Button variant="contained" onClick={() => navigate('/')} sx={{ background: themeColors.primaryGradient }}>Go Home</Button>
//             </Box>
//         </Box>
//      );
//   }
  
//   return (
//     <motion.div initial="initial" animate="in" exit="out" variants={pageVariants}>
//       <Box sx={{ background: themeColors.bg, minHeight: '100vh', p: {xs: 2, sm: 3, md: 4} }}>
        
//         <ProfileHeader 
//             profileData={profileData} 
//             themeColors={themeColors}
//             isDarkMode={isDarkMode}
//             onThemeToggle={() => setIsDarkMode(!isDarkMode)}
//             onLogout={handleLogout}
//         />

//         <Box sx={{ width: '100%', mt: 4 }}>
//           <Tab.Group>
//             <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
//                  {[{name: 'Creations', icon: FaPalette}, {name: 'Friends', icon: FaUsers}, {name: 'Activity', icon: FaChartLine}].map((tab) => (
//                     <Tab as={Fragment} key={tab.name}>
//                         {({ selected }) => (
//                         <button
//                             style={{
//                                 color: selected ? themeColors.tabActive : themeColors.tabInactive,
//                                 outline: 'none',
//                                 transition: 'color 0.3s',
//                                 fontWeight: selected ? 'bold' : 'normal',
//                             }}
//                             className="w-full relative rounded-lg py-2.5 text-sm font-medium leading-5"
//                         >
//                             <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1}}>
//                                 <tab.icon/>
//                                 {tab.name}
//                             </Box>
//                             {selected && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5" style={{background: themeColors.primaryGradient}} layoutId="underline" />}
//                         </button>
//                         )}
//                     </Tab>
//                  ))}
//             </Tab.List>
//             <Tab.Panels as={AnimatePresence} initial={false}>
//               <Tab.Panel as={motion.div} variants={tabContentVariants} initial="initial" animate="enter" exit="exit" sx={{mt: 3}}>
//                  {/* POSTS / CREATIONS */}
//                  {Array.isArray(posts) && posts.length > 0 ? (
//                     <Masonry
//                         breakpointCols={masonryBreakpoints}
//                         className="my-masonry-grid"
//                         columnClassName="my-masonry-grid_column"
//                     >
//                         {posts.map(post => (
//                             <div key={post._id} style={{marginBottom: '16px'}}>
//                                 <Post post={post} setCurrentId={() => {}} setShowForm={() => {}} />
//                             </div>
//                         ))}
//                     </Masonry>
//                  ) : (
//                     <Box sx={{ textAlign: 'center', py: 8, color: themeColors.textMuted }}>
//                         <FaRocket size={50} style={{ marginBottom: 16 }} />
//                         <Typography variant="h6">No Creations Yet</Typography>
//                         <Typography>This user hasn't posted anything.</Typography>
//                     </Box>
//                  )}
//               </Tab.Panel>
//               <Tab.Panel as={motion.div} variants={tabContentVariants} initial="initial" animate="enter" exit="exit" sx={{mt: 3, background: themeColors.cardBg, p: 3, borderRadius: '16px'}}>
//                  {/* FRIENDS LIST (replaces right sidebar) */}
//                  <Grid container spacing={2}>
//                     {users.filter(u => u._id !== profile).map(friend => (
//                        <Grid item xs={12} sm={6} md={4} key={friend._id}>
//                            <Box sx={{display: 'flex', alignItems: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: '12px', transition: 'all 0.3s', '&:hover': {transform: 'translateY(-5px)', background: 'rgba(255,255,255,0.1)'}}}>
//                                 <ListItemAvatar>
//                                    <Badge
//                                       overlap="circular"
//                                       anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                                       variant="dot"
//                                       sx={{ '& .MuiBadge-badge': { backgroundColor: onlineUsers?.includes(friend._id) ? '#4ade80' : '#9ca3af', animation: onlineUsers?.includes(friend._id) ? `${pulseOnline} 2s infinite` : 'none', border: `2px solid ${themeColors.cardBg}` } }}
//                                    >
//                                      <Avatar sx={{ background: themeColors.primaryGradient }}>{friend.name?.charAt(0)}</Avatar>
//                                    </Badge>
//                                 </ListItemAvatar>
//                                 <ListItemText primary={friend.name} secondary={onlineUsers?.includes(friend._id) ? 'Online' : 'Offline'} primaryTypographyProps={{fontWeight: 'bold', color: themeColors.text}} secondaryTypographyProps={{color: onlineUsers?.includes(friend._id) ? '#4ade80' : themeColors.textMuted}} />
//                            </Box>
//                        </Grid>
//                     ))}
//                  </Grid>
//               </Tab.Panel>
//               <Tab.Panel as={motion.div} variants={tabContentVariants} initial="initial" animate="enter" exit="exit" sx={{mt: 3}}>
//                 {/* ACTIVITY (Conceptual) */}
//                 <Box sx={{ textAlign: 'center', py: 8, color: themeColors.textMuted }}>
//                     <FaChartLine size={50} style={{ marginBottom: 16 }} />
//                     <Typography variant="h6">Activity Feed Coming Soon</Typography>
//                     <Typography>Recent likes, comments, and follows will appear here.</Typography>
//                 </Box>
//               </Tab.Panel>
//             </Tab.Panels>
//           </Tab.Group>
//         </Box>
//       </Box>
//        {/* CSS for Masonry Grid - you can add this to your index.css or a <style> tag */}
//       <style>{`
//         .my-masonry-grid {
//           display: -webkit-box;
//           display: -ms-flexbox;
//           display: flex;
//           margin-left: -16px; /* gutter size offset */
//           width: auto;
//         }
//         .my-masonry-grid_column {
//           padding-left: 16px; /* gutter size */
//           background-clip: padding-box;
//         }
//       `}</style>
//     </motion.div>
//   );
// };

// export default Profile;