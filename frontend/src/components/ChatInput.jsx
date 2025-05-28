import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../actions/message';
import { FaPaperPlane, FaImage, FaSmile } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInput = () => {
  const [post, setPost] = useState({
    image: '',
    text: '',
  });
  const [isTyping, setIsTyping] = useState(false);
  const { selectedUser } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!post.text.trim() && !post.image) return;

    dispatch(sendMessage(selectedUser._id, post));
    setPost({ image: '', text: '' });
    setIsTyping(false);
  };

  const handleInputChange = (e) => {
    setPost({ ...post, text: e.target.value });
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <div className="stiky bottom-0 p-8 bg-gradient-to-r from-gray-800 to-gray-700 border-t border-gray-700/50 backdrop-blur-sm">
      {/* Image Preview */}
      <AnimatePresence>
        {post.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 relative inline-block"
          >
            <img
              src={post.image}
              alt="Preview"
              className="max-w-32 max-h-32 rounded-xl shadow-lg"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setPost((prev) => ({ ...prev, image: '' }))}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs transition-colors"
            >
              ×
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Area */}
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* Photo Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-xl bg-gray-700/50 hover:bg-purple-600/50 transition-all duration-200 group"
          title="Add Photo"
        >
          <FaImage className="text-purple-400 group-hover:text-white text-lg" />
        </motion.button>

        {/* Message Input Container */}
        <div className="flex-grow relative">
          <motion.div
            animate={{
              boxShadow: isTyping 
                ? '0 0 20px rgba(59, 130, 246, 0.3)' 
                : '0 0 0px rgba(59, 130, 246, 0)'
            }}
            className="relative bg-gray-700/80 backdrop-blur-sm rounded-2xl border border-gray-600/50 overflow-hidden"
          >
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full bg-transparent px-6 py-4 pr-12 text-white placeholder-gray-400 focus:outline-none resize-none"
              value={post.text}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            {/* Emoji Button Inside Input */}
           
            
            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-1 left-6 flex space-x-1"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className="w-1 h-1 bg-blue-400 rounded-full"
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Send Button */}
        <motion.button
          type="submit"
          disabled={!post.text.trim() && !post.image}
          whileHover={{ scale: post.text.trim() || post.image ? 1.05 : 1 }}
          whileTap={{ scale: post.text.trim() || post.image ? 0.95 : 1 }}
          className={`p-3 rounded-xl transition-all duration-200 ${
            post.text.trim() || post.image
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-blue-500/25'
              : 'bg-gray-700/50 cursor-not-allowed'
          }`}
          title="Send Message"
        >
          <motion.div
            animate={{
              rotate: post.text.trim() || post.image ? [0, 10, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <FaPaperPlane 
              className={`text-lg ${
                post.text.trim() || post.image ? 'text-white' : 'text-gray-500'
              }`} 
            />
          </motion.div>
        </motion.button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setPost((prev) => ({ ...prev, image: reader.result }));
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </form>
    </div>
  );
};

export default ChatInput;