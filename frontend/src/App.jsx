import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import './index.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Auth from './components/Auth';
import Chat from './components/Chat';
import NotFound from './components/NotFound';

import { getPosts } from './actions/post';
import { fetchUsers } from './actions/message';
import Profile from './components/Profile';
import LikedPosts from './components/LikedPosts';

function App() {
 
  return (
    <BrowserRouter>
      <AppContent />
       <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}


const AppContent = () => {
   const dispatch = useDispatch();
  
  useEffect(() => {
    
    dispatch(fetchUsers());
  }, [dispatch]);
  
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('profile'));
    setUser(storedUser);
  }, [location]);

  return (
    <div>
      <Navbar setShowForm={setShowForm} />
      <div style={{ minHeight: '100vh', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/posts" />} />
          <Route path="/posts" element={<Home showForm={showForm} setShowForm={setShowForm} />} />
          <Route path="/posts/search" element={<Home showForm={showForm} setShowForm={setShowForm} />} />
          <Route path="/auth" element={user ? <Navigate to="/posts" replace /> : <Auth />} />
          <Route path="/chat" element={user ? <Chat /> : <Navigate to="/posts" replace />} />
          <Route path='/posts/profile/:profile' element={<Profile />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/posts/likes" element={user ? <LikedPosts /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
