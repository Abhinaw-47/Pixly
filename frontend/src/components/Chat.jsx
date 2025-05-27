import React from 'react';
import ChatContainer from './ChatContainer';
import { useSelector, useDispatch } from 'react-redux';
import { FaUserCircle, FaUsers, FaComments, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const dispatch = useDispatch();
  const { users, isUserLoading, selectedUser} = useSelector((state) => state.message);
  const {onlineUsers} = useSelector((state) => state.auth);

  if (!users?.length && !isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50"
        >
          <FaUsers className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Users Available</h3>
          <p className="text-gray-400">Start by adding some friends to chat with</p>
        </motion.div>
      </div>
    );
  }

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading users...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-w-7xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900  shadow-2xl overflow-hidden border border-gray-700/50">
      
      {/* Users List */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-1/3 bg-gray-800/80 backdrop-blur-sm border-r border-gray-700/50"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-xl">
              <FaComments className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Messages</h2>
              <p className="text-gray-400 text-sm">{users?.length} contacts</p>
            </div>
          </div>
          
        
        </div>

        {/* Users List */}
        <div className="overflow-y-auto h-full p-4 space-y-2">
          <AnimatePresence>
            {users.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedUser?._id === user._id 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg' 
                    : 'hover:bg-gray-700/50 backdrop-blur-sm'
                }`}
                onClick={() => dispatch({ type: 'SELECT_USER', payload: user })}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <FaUserCircle size={28} className="text-white" />
                  </div>
                  <motion.div
                    initial={false}
                    animate={{
                      scale: onlineUsers.includes(user._id) ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                      onlineUsers.includes(user._id) ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{user.name}</h3>
                  <p className={`text-sm truncate ${
                    selectedUser?._id === user._id ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                  </p>
                </div>

                {selectedUser?._id === user._id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Chat Container */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-2/3 bg-gray-900/80 backdrop-blur-sm flex flex-col"
      >
        <ChatContainer />
      </motion.div>
    </div>
  );
};

export default Chat;