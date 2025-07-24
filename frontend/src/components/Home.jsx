// import React, { useState, useEffect } from 'react';
// import { Box, Modal, Fade, Paper, useMediaQuery, useTheme } from '@mui/material';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

// import { getPostsBySearch } from '../actions/post';
// import { connectSocket, disconnectSocket } from '../api';
// import { fetchUsers, fetchAllMessages } from '../actions/message';

// import LeftSidebar from './LeftSidebar';
// import MainFeed from './MainFeed';
// import RightSidebar from './RightSidebar';
// import Background from './Background';
// import Form from './Form';
// import BottomNavBar from './BottomNavBar';

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

// const SIDEBAR_WIDTH = 380;
// const NAVBAR_HEIGHT = '88px'; // Define your navbar height as a variable

// const Home = ({ showForm, setShowForm }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const theme = useTheme();
//   const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

//   const [currentId, setCurrentId] = useState(0);
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
//   const [search, setSearch] = useState('');
  
//   const { users, messages } = useSelector((state) => state.message || { users: [], messages: [] });
//   const { onlineUsers } = useSelector((state) => state.auth || { onlineUsers: [] });
  
//   const query = useQuery();
//   const page = query.get('page') || 1;
//   const searchQuery = query.get('searchQuery');

//   const getRecentMessages = () => {
//     if (!messages || !Array.isArray(messages) || !user) return [];
//     const messagesByUser = {};
//     messages.forEach(msg => {
//       const otherUserId = msg.senderId === user.result._id ? msg.receiverId : msg.senderId;
//       const otherUser = users?.find(u => u._id === otherUserId);
//       if (otherUser && (!messagesByUser[otherUserId] || new Date(msg.createdAt) > new Date(messagesByUser[otherUserId].createdAt))) {
//         messagesByUser[otherUserId] = { ...msg, userName: otherUser.name, userId: otherUserId };
//       }
//     });
//     return Object.values(messagesByUser)
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//       .slice(0, 3)
//       .map(msg => ({ user: msg.userName, message: msg.text || 'Attachment', userId: msg.userId }));
//   };
//   const recentMessages = getRecentMessages();

//   useEffect(() => {
//     const currUser = JSON.parse(localStorage.getItem('profile'));
//     setUser(currUser);
    
//     if (currUser) {
//       const socket = connectSocket();
//       if (socket) {
//         socket.on('getOnlineUsers', (userIds) => dispatch({ type: 'SET_ONLINE_USERS', payload: userIds || [] }));
//         dispatch(fetchUsers());
//         dispatch(fetchAllMessages());
//         return () => socket.off('getOnlineUsers');
//       }
//     } else {
//       disconnectSocket();
//     }
//   }, [location.pathname, dispatch]);

//   const handleSearch = () => {
//     if (search.trim()) {
//       dispatch(getPostsBySearch({ search }));
//       navigate(`/posts/search?searchQuery=${search}`);
//     } else {
//       navigate('/');
//     }
//   };
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') handleSearch();
//   };
//   const handleLogout = () => {
//     dispatch({ type: 'LOGOUT' });
//     localStorage.removeItem('profile');
//     setUser(null);
//     disconnectSocket();
//     dispatch({ type: 'FETCH_USERS_SUCCESS', payload: [] });
//     navigate('/');
//   };

//   return (
    
    
//     <Box sx={{ minHeight: '100vh', display: 'flex', position: 'relative' }}>
//      <Background />

//       <Box sx={{ display: 'flex', width: '100%', position: 'relative', zIndex: 1, pt: '68px' }}>
//         {isDesktop && (
//           <Box sx={{ width: SIDEBAR_WIDTH, position: 'fixed', top:'90px', left: 0, height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
//             <LeftSidebar user={user} onLogout={handleLogout} onShowForm={() => setShowForm(true)} />
//           </Box>
//         )}

//         <Box sx={{ flexGrow: 1, ml: isDesktop ? `${SIDEBAR_WIDTH}px` : 0, mr: isDesktop ? `${SIDEBAR_WIDTH}px` : 0, height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
//           <MainFeed
//             search={search}
//             setSearch={setSearch}
//             handleSearch={handleSearch}
//             handleKeyDown={handleKeyDown}
//             setCurrentId={setCurrentId}
//             setShowForm={setShowForm}
//             page={page}
//             searchQuery={searchQuery}
//           />
//         </Box>

//         {isDesktop && (
//           <Box sx={{ width: SIDEBAR_WIDTH, position: 'fixed', top:'90px', right: 0, height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
//             <RightSidebar user={user} allUsers={users} onlineUsers={onlineUsers} recentMessages={recentMessages} />
//           </Box>
//         )}
//       </Box>

//       {user && <BottomNavBar onShowForm={() => setShowForm(true)} />}
      
//       <Modal open={showForm} onClose={() => setShowForm(false)} closeAfterTransition>
//         <Fade in={showForm} timeout={500}>
//           <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
//             <Paper sx={{ borderRadius: '20px', background: 'rgba(28, 28, 45, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 255, 255, 0.3)', position: 'relative' }}>
//               <Form currentId={currentId} setCurrentId={setCurrentId} setShowForm={setShowForm} />
//             </Paper>
//           </Box>
//         </Fade>
//       </Modal>
//     </Box>
    
//   );
// };

// export default Home;


import React, { useState, useEffect } from 'react';
import { Box, Modal, Fade, Paper, useMediaQuery, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getPostsBySearch } from '../actions/post';
import { connectSocket, disconnectSocket } from '../api';
import { fetchUsers, fetchAllMessages } from '../actions/message';

import LeftSidebar from './LeftSidebar';
import MainFeed from './MainFeed';
import RightSidebar from './RightSidebar';
import Background from './Background';
import Form from './Form';
import BottomNavBar from './BottomNavBar';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SIDEBAR_WIDTH = 380;
const NAVBAR_HEIGHT = '88px';

const HomePage = ({ showForm, setShowForm }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [currentId, setCurrentId] = useState(0);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const [search, setSearch] = useState('');
  
  const { users, messages } = useSelector((state) => state.message || { users: [], messages: [] });
  const { onlineUsers } = useSelector((state) => state.auth || { onlineUsers: [] });
  
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  const getRecentMessages = () => {
    if (!messages || !Array.isArray(messages) || !user) return [];
    const messagesByUser = {};
    messages.forEach(msg => {
      const otherUserId = msg.senderId === user.result._id ? msg.receiverId : msg.senderId;
      const otherUser = users?.find(u => u._id === otherUserId);
      if (otherUser && (!messagesByUser[otherUserId] || new Date(msg.createdAt) > new Date(messagesByUser[otherUserId].createdAt))) {
        messagesByUser[otherUserId] = { ...msg, userName: otherUser.name, userId: otherUserId };
      }
    });
    return Object.values(messagesByUser).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3).map(msg => ({ user: msg.userName, message: msg.text || 'Attachment', userId: msg.userId }));
  };
  const recentMessages = getRecentMessages();

  useEffect(() => {
    const currUser = JSON.parse(localStorage.getItem('profile'));
    setUser(currUser);
    
    if (currUser) {
      const socket = connectSocket();
      if (socket) {
        socket.on('getOnlineUsers', (userIds) => dispatch({ type: 'SET_ONLINE_USERS', payload: userIds || [] }));
        dispatch(fetchUsers());
        dispatch(fetchAllMessages());
        return () => socket.off('getOnlineUsers');
      }
    } else {
      disconnectSocket();
    }
  }, [location.pathname, dispatch]);

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
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('profile');
    setUser(null);
    disconnectSocket();
    dispatch({ type: 'FETCH_USERS_SUCCESS', payload: [] });
    navigate('/');
  };

  // ✨ BUG FIX: This function ensures currentId is reset when the modal is closed.
  const handleFormClose = () => {
    setShowForm(false);
    setCurrentId(0);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', position: 'relative' }}>
      <Background />
      <Box sx={{ display: 'flex', width: '100%', position: 'relative', zIndex: 1, pt: '58px' }}>
        {isDesktop && (
          <Box sx={{ width: SIDEBAR_WIDTH, position: 'fixed', top: '90px', left: 0, height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
            <LeftSidebar onLogout={handleLogout} onShowForm={() => setShowForm(true)} />
          </Box>
        )}
        <Box sx={{ flexGrow: 1, ml: isDesktop ? `${SIDEBAR_WIDTH}px` : 0, mr: isDesktop ? `${SIDEBAR_WIDTH}px` : 0, height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
          <MainFeed search={search} setSearch={setSearch} handleSearch={handleSearch} handleKeyDown={handleKeyDown} setCurrentId={setCurrentId} setShowForm={setShowForm} page={page} searchQuery={searchQuery} />
        </Box>
        {isDesktop && (
          <Box sx={{ width: SIDEBAR_WIDTH, position: 'fixed', top:'90px', right: 0, height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
            <RightSidebar user={user} allUsers={users} onlineUsers={onlineUsers} recentMessages={recentMessages} />
          </Box>
        )}
      </Box>
      {user && <BottomNavBar onShowForm={() => { setCurrentId(0); setShowForm(true); }} />}
      
      {/* ✨ BUG FIX: Use the new handleFormClose function here */}
      <Modal open={showForm} onClose={handleFormClose} closeAfterTransition>
        <Fade in={showForm} timeout={500}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <Paper sx={{ borderRadius: '20px', background: 'rgba(28, 28, 45, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 255, 255, 0.3)', position: 'relative' }}>
              <Form currentId={currentId} setCurrentId={setCurrentId} setShowForm={setShowForm} />
            </Paper>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default HomePage;