// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getMessages } from '../actions/message';
// import ChatInput from './ChatInput';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaUserCircle, FaTimes, FaPhone, FaVideo, FaEllipsisV, FaPaperPlane, FaHeart } from 'react-icons/fa';
// import { connectSocket, getSocket } from '../api';

// import { useCallback } from 'react';
// const ChatContainer = () => {
//   const dispatch = useDispatch();
//   const { isMsgLoading, selectedUser, messages} = useSelector((state) => state.message);
//   const {onlineUsers} = useSelector((state) => state.auth);
//   //  const subscribeTomessages=()=>{
//   //   if(!selectedUser) return;
//   //   const socket=connectSocket();
//   //   socket.on("getMessage", (messages) => {
//   //     dispatch({ type: "SEND_MESSAGE", payload: messages });
//   //   })
//   //  }
//    const subscribeToMessages = useCallback(() => {
//     if (!selectedUser) return;
//     const socket = connectSocket();
//     console.log("before subscribe")
//     socket.off("receiveMessage"); // clear any previous
//     socket.on("receiveMessage", (message) => {
//       console.log("Subscribed")
//       dispatch({ type: "SEND_MESSAGE", payload: message });
//     });
//   }, [selectedUser, dispatch]);
//   //  const unsubscribeTomessages=()=>{
//   //   if(!selectedUser) return;
//   //   const socket=connectSocket();
//   //   socket.off("getMessage");
//   //  }

//   const unsubscribeFromMessages = useCallback(() => {
//     const socket = getSocket();
//     if (!socket || !selectedUser) return;
//     socket.off("receiveMessage");
//   }, [selectedUser]);

//   useEffect(() => {
//     if (selectedUser !== null) {
//       dispatch(getMessages(selectedUser._id));
//       subscribeToMessages();
//     }
    

//     return () => {
//       console.log("Unsubscribed")
//       unsubscribeFromMessages();
//     };

    
//   }, [selectedUser, dispatch,subscribeToMessages,unsubscribeFromMessages]);

//   // Helper function to format time
//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString('en-US', { 
//       hour: 'numeric', 
//       minute: '2-digit', 
//       hour12: true 
//     });
//   };

//   // Helper function to format date
//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     if (date.toDateString() === today.toDateString()) {
//       return 'Today';
//     } else if (date.toDateString() === yesterday.toDateString()) {
//       return 'Yesterday';
//     } else {
//       return date.toLocaleDateString('en-US', { 
//         weekday: 'long', 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric' 
//       });
//     }
//   };

//   // Helper function to check if we need a date separator
//   const needsDateSeparator = (currentMessage, previousMessage) => {
//     if (!previousMessage) return true;
    
//     const currentDate = new Date(currentMessage.createdAt || currentMessage.timestamp || Date.now());
//     const previousDate = new Date(previousMessage.createdAt || previousMessage.timestamp || Date.now());
    
//     return currentDate.toDateString() !== previousDate.toDateString();
//   };

//   // Group messages by date and add separators
//   const getMessagesWithDateSeparators = () => {
//     if (!messages || messages.length === 0) return [];
    
//     const messagesWithSeparators = [];
    
//     messages.forEach((message, index) => {
//       const previousMessage = index > 0 ? messages[index - 1] : null;
      
//       if (needsDateSeparator(message, previousMessage)) {
//         messagesWithSeparators.push({
//           type: 'date-separator',
//           date: message.createdAt || message.timestamp || Date.now(),
//           id: `date-${index}`
//         });
//       }
      
//       messagesWithSeparators.push({
//         ...message,
//         type: 'message'
//       });
//     });
    
//     return messagesWithSeparators;
//   };

//   if (selectedUser === null) {
//     return (
//       <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center p-8 max-w-md"
//         >
//           <motion.div
//             animate={{ 
//               rotate: [0, 10, -10, 0],
//               scale: [1, 1.1, 1]
//             }}
//             transition={{ 
//               duration: 2,
//               repeat: Infinity,
//               repeatDelay: 3
//             }}
//             className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
//           >
//             <FaPaperPlane className="text-white text-3xl" />
//           </motion.div>
//           <h3 className="text-2xl font-bold text-white mb-3">Start a Conversation</h3>
//           <p className="text-gray-400 leading-relaxed">
//             Select a friend from the sidebar to begin chatting and sharing memorable moments together.
//           </p>
//           <motion.div
//             initial={{ width: 0 }}
//             animate={{ width: '100%' }}
//             transition={{ duration: 1, delay: 0.5 }}
//             className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-6"
//           />
//         </motion.div>
//       </div>
//     );
//   }

//   if (isMsgLoading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center"
//         >
//           <div className="flex space-x-2 mb-4">
//             {[0, 1, 2].map((i) => (
//               <motion.div
//                 key={i}
//                 animate={{
//                   y: [0, -20, 0],
//                 }}
//                 transition={{
//                   duration: 0.6,
//                   repeat: Infinity,
//                   delay: i * 0.2,
//                 }}
//                 className="w-3 h-3 bg-blue-500 rounded-full"
//               />
//             ))}
//           </div>
//           <p className="text-white">Loading messages...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   const messagesWithSeparators = getMessagesWithDateSeparators();
//  const isVideo = messages.image?.startsWith("data:video");
//   return (
//     <div className="flex flex-col h-full">
//       {/* Chat Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700/50"
//       >
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
//               <FaUserCircle size={28} className="text-white" />
//             </div>
//             <motion.div
//               animate={{
//                 scale: onlineUsers.includes(selectedUser._id) ? [1, 1.2, 1] : 1,
//               }}
//               transition={{ duration: 0.3 }}
//               className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-700 ${
//                 onlineUsers.includes(selectedUser._id) ? 'bg-green-500' : 'bg-gray-500'
//               }`}
//             />
//           </div>
//           <div>
//             <h3 className="text-lg font-bold text-white">{selectedUser.name}</h3>
//             <motion.p
//               animate={{ opacity: [0.5, 1, 0.5] }}
//               transition={{ duration: 2, repeat: Infinity }}
//               className={`text-sm ${
//                 onlineUsers.includes(selectedUser._id) ? 'text-green-400' : 'text-gray-400'
//               }`}
//             >
//               {onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Offline'}
//             </motion.p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => dispatch({ type: 'SELECT_USER', payload: null })}
//             className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
//             title="Close Chat"
//           >
//             <FaTimes className="text-red-400 hover:text-red-300" size={16} />
//           </motion.button>
//         </div>
//       </motion.div>

//       {/* Messages Area */}
//       <div className="flex flex-col h-full">
//       <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-900/30 to-gray-900/50">
//         <AnimatePresence>
//           {messagesWithSeparators.map((item, index) => {
//             if (item.type === 'date-separator') {
//               return (
//                 <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
//                   <div className="text-gray-400 text-sm font-semibold my-4">{formatDate(item.date)}</div>
//                 </motion.div>
//               );
//             }

//             const isVideo = item.image && item.image.startsWith("data:video");

//             return (
//               <motion.div
//                 key={item._id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className={`flex ${item.senderId === selectedUser._id ? 'justify-start' : 'justify-end'}`}
//               >
//                 <div className="max-w-xs lg:max-w-md">
//                   {item.image ? (
//                     <motion.div whileHover={{ scale: 1.02 }} className="relative overflow-hidden rounded-2xl shadow-xl">
//                       {isVideo ? (
//                         <video
//                           src={item.image}
//                           controls
//                           className="w-full h-auto rounded-2xl"
//                         />
//                       ) : (
//                         <img
//                           src={item.image}
//                           alt="Sent content"
//                           className="w-full h-auto rounded-2xl"
//                         />
//                       )}
//                       <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-md">
//                         <span className="text-white text-xs">{formatTime(item.createdAt)}</span>
//                       </div>
//                     </motion.div>
//                   ) : (
//                     <motion.div
//                       whileHover={{ scale: 1.02 }}
//                       className={`relative p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
//                         item.senderId === selectedUser._id
//                           ? 'bg-gray-700/80 text-white'
//                           : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
//                       }`}
//                     >
//                       <p className="break-words leading-relaxed mb-1">{item.text}</p>
//                       <div className="flex justify-end text-xs opacity-70 mt-2">
//                         {formatTime(item.createdAt)}
//                       </div>
//                     </motion.div>
//                   )}
//                 </div>
//               </motion.div>
//             );
//           })}
//         </AnimatePresence>
//       </div>
   

//       {/* Chat Input */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3 }}
//       >
//         <ChatInput />
//       </motion.div>
//     </div>
//   </div>
//   );
// };

// export default ChatContainer;




import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages } from '../actions/message';
import ChatInput from './ChatInput';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaTimes, FaPhone, FaVideo, FaEllipsisV, FaPaperPlane, FaHeart } from 'react-icons/fa';
import { connectSocket, getSocket } from '../api';

import { useCallback } from 'react';
const ChatContainer = () => {
  const dispatch = useDispatch();
  const { isMsgLoading, selectedUser, messages} = useSelector((state) => state.message);
  const {onlineUsers} = useSelector((state) => state.auth);
  //  const subscribeTomessages=()=>{
  //   if(!selectedUser) return;
  //   const socket=connectSocket();
  //   socket.on("getMessage", (messages) => {
  //     dispatch({ type: "SEND_MESSAGE", payload: messages });
  //   })
  //  }
   const subscribeToMessages = useCallback(() => {
    if (!selectedUser) return;
    const socket = connectSocket();
    console.log("before subscribe")
    socket.off("receiveMessage"); // clear any previous
    socket.on("receiveMessage", (message) => {
      console.log("Subscribed")
      dispatch({ type: "SEND_MESSAGE", payload: message });
    });
  }, [selectedUser, dispatch]);
  //  const unsubscribeTomessages=()=>{
  //   if(!selectedUser) return;
  //   const socket=connectSocket();
  //   socket.off("getMessage");
  //  }

  const unsubscribeFromMessages = useCallback(() => {
    const socket = getSocket();
    if (!socket || !selectedUser) return;
    socket.off("receiveMessage");
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser !== null) {
      dispatch(getMessages(selectedUser._id));
      subscribeToMessages();
    }
    

    return () => {
      console.log("Unsubscribed")
      unsubscribeFromMessages();
    };

    
  }, [selectedUser, dispatch,subscribeToMessages,unsubscribeFromMessages]);

  // Helper function to format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // Helper function to format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  // Helper function to check if we need a date separator
  const needsDateSeparator = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.createdAt || currentMessage.timestamp || Date.now());
    const previousDate = new Date(previousMessage.createdAt || previousMessage.timestamp || Date.now());
    
    return currentDate.toDateString() !== previousDate.toDateString();
  };

  // Group messages by date and add separators
  const getMessagesWithDateSeparators = () => {
    if (!messages || messages.length === 0) return [];
    
    const messagesWithSeparators = [];
    
    messages.forEach((message, index) => {
      const previousMessage = index > 0 ? messages[index - 1] : null;
      
      if (needsDateSeparator(message, previousMessage)) {
        messagesWithSeparators.push({
          type: 'date-separator',
          date: message.createdAt || message.timestamp || Date.now(),
          id: `date-${index}`
        });
      }
      
      messagesWithSeparators.push({
        ...message,
        type: 'message'
      });
    });
    
    return messagesWithSeparators;
  };

  if (selectedUser === null) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 max-w-md"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <FaPaperPlane className="text-white text-3xl" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-3">Start a Conversation</h3>
          <p className="text-gray-400 leading-relaxed">
            Select a friend from the sidebar to begin chatting and sharing memorable moments together.
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-6"
          />
        </motion.div>
      </div>
    );
  }

  if (isMsgLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="flex space-x-2 mb-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 bg-blue-500 rounded-full"
              />
            ))}
          </div>
          <p className="text-white">Loading messages...</p>
        </motion.div>
      </div>
    );
  }

  const messagesWithSeparators = getMessagesWithDateSeparators();

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700/50"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <FaUserCircle size={28} className="text-white" />
            </div>
            <motion.div
              animate={{
                scale: onlineUsers.includes(selectedUser._id) ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-700 ${
                onlineUsers.includes(selectedUser._id) ? 'bg-green-500' : 'bg-gray-500'
              }`}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{selectedUser.name}</h3>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`text-sm ${
                onlineUsers.includes(selectedUser._id) ? 'text-green-400' : 'text-gray-400'
              }`}
            >
              {onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Offline'}
            </motion.p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'SELECT_USER', payload: null })}
            className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
            title="Close Chat"
          >
            <FaTimes className="text-red-400 hover:text-red-300" size={16} />
          </motion.button>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div
        className="flex-grow overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-900/30 to-gray-900/50"
        style={{ maxHeight: 'calc(100vh - 220px)' }}
      >
        <AnimatePresence>
          {messagesWithSeparators.length > 0 ? (
            messagesWithSeparators.map((item, index) => {
              if (item.type === 'date-separator') {
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center my-6"
                  >
                    <div className="bg-gray-700/60 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-gray-300 text-sm font-medium">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </motion.div>
                );
              }

              const message = item;
              const isVideo = item.image && item.image.startsWith("data:video");
              return (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className={`flex ${message.senderId === selectedUser._id ? 'justify-start' : 'justify-end'} group`}
                >
                  <div className={`max-w-xs lg:max-w-md ${message.senderId === selectedUser._id ? 'order-2' : 'order-1'}`}>
                    {message.image ? (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative overflow-hidden rounded-2xl shadow-xl"
                      >
                         {isVideo ? (
                        <video
                          src={item.image}
                          controls
                          className="w-full h-auto rounded-2xl"
                        />
                      ) : (
                        <img
                          src={item.image}
                          alt="Sent content"
                          className="w-full h-auto rounded-2xl"
                        />
                      )}
                        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
                          <span className="text-white text-xs">
                            {formatTime(message.createdAt || message.timestamp || Date.now())}
                          </span>
                        </div>
                        <div className="absolute duration-200 pointer-events-none" />

                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`relative p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                          message.senderId === selectedUser._id 
                            ? 'bg-gray-700/80 text-white rounded-bl-md' 
                            : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md'
                        }`}
                      >
                        <p className="break-words leading-relaxed mb-1">{message.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-2">
                          <span className="text-xs opacity-70">
                            {formatTime(message.createdAt || message.timestamp || Date.now())}
                          </span>
                          {message.senderId !== selectedUser._id && (
                            <div className="opacity-60">
                              {/* Read status indicators can be added here */}
                              <svg width="16" height="16" viewBox="0 0 16 16" className="text-white">
                                <path
                                  fill="currentColor"
                                  d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l2.541 2.434c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.512z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className={`absolute bottom-1 ${
                          message.senderId === selectedUser._id ? 'left-1' : 'right-1'
                        } opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                          <FaHeart className="text-xs opacity-50" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full"
            >
              <div className="text-center p-8">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <FaPaperPlane className="text-blue-400 text-2xl" />
                </motion.div>
                <h4 className="text-lg font-semibold text-white mb-2">No messages yet</h4>
                <p className="text-gray-400">Send a message to start the conversation!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ChatInput />
      </motion.div>
    </div>
  );
};

export default ChatContainer;
