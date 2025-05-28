import React, { useState, useEffect } from 'react';
import Form from './Form';
import Posts from './Posts/Posts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaSearch, FaComments, FaUpload } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getPostsBySearch } from '../actions/post';
import { connectSocket } from '../api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = ({ showForm, setShowForm }) => {
  const dispatch = useDispatch();
  const [currentId, setCurrentId] = useState(0);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    if (search.trim()) {
      dispatch(getPostsBySearch({ search }));
      navigate(`/search?searchQuery=${search || 'none'}`);
    } else {
      navigate('/');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  useEffect(() => {
    if (searchQuery) {
      dispatch(getPostsBySearch({ search: searchQuery }));
    }
  }, [dispatch, searchQuery]);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')));
    const currUser= JSON.parse(localStorage.getItem('profile'));
    if (currUser) connectSocket();
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Fixed Search Bar */}
      <div className="fixed top-[110px] w-full px-4 z-40">
        <div className="relative w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800/90 backdrop-blur-sm text-white placeholder-gray-400 px-5 py-4 pr-14 rounded-2xl border border-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 focus:outline-none shadow-lg"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 p-3 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg"
            aria-label="Search"
          >
            <FaSearch size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="pt-32 pb-16 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <Posts setCurrentId={setCurrentId} setShowForm={setShowForm} />
        </div>
      </motion.div>

      {/* Floating Chat Button */}
      {user && (
        <div>
          <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/chat')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-blue-500/20 z-50"
        title="Open Chats"
      >
        <FaComments size={24} />
      </motion.button>
        {/* Floating Upload Post Button */}
          <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowForm(true)}
        title="Upload Post"
        className="fixed top-[120px] right-6 z-50 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 border border-purple-300/20"
      >
        <FaUpload size={20} />
      </motion.button>
        </div>
      )
      }
    
     

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl w-full max-w-lg shadow-2xl relative"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700/50"
              >
                <span className="text-xl font-bold">&times;</span>
              </motion.button>
              <Form currentId={currentId} setCurrentId={setCurrentId} setShowForm={setShowForm} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="bg-gray-900/50 border-t border-gray-800/50 mt-auto"
      >
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-500 text-sm">© 2025 Pixly by ABHINAW ANAND. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
