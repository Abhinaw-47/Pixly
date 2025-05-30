import React from 'react';
import { useSelector } from 'react-redux';
import Post from './post/Post';
import { FiLoader } from 'react-icons/fi';
import { MdOutlinePostAdd, MdExplore } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

// Consistent styling constants
const COLORS = {
  primary: '#3b82f6',
  gradient: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)',
  cardBg: 'rgba(31, 41, 55, 0.8)',
  text: '#ffffff',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  border: 'rgba(75, 85, 99, 0.3)',
  shadow: 'rgba(0, 0, 0, 0.25)'
};

const Posts = ({ setCurrentId, setShowForm }) => {
  const { posts, isLoading } = useSelector((state) => state.post);

  // Empty State Component
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", damping: 25 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        textAlign: 'center',
        padding: '40px 20px'
      }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          background: COLORS.cardBg,
          borderRadius: '24px',
          padding: '48px 32px',
          border: `1px solid ${COLORS.border}`,
          boxShadow: `0 20px 40px ${COLORS.shadow}`,
          backdropFilter: 'blur(20px)',
          maxWidth: '400px',
          width: '100%'
        }}
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
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '20px',
            padding: '20px',
            display: 'inline-flex',
            marginBottom: '24px'
          }}
        >
          <MdExplore size={48} color="white" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            color: COLORS.text,
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '12px',
            margin: 0
          }}
        >
          No Posts Yet
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            color: COLORS.textMuted,
            fontSize: '16px',
            lineHeight: '1.5',
            margin: '12px 0 0'
          }}
        >
          Be the first to share something amazing with the community!
        </motion.p>
      </motion.div>
    </motion.div>
  );

  // Loading State Component
  const LoadingState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        textAlign: 'center'
      }}
    >
      <motion.div
        style={{
          background: COLORS.cardBg,
          borderRadius: '20px',
          padding: '40px',
          border: `1px solid ${COLORS.border}`,
          boxShadow: `0 20px 40px ${COLORS.shadow}`,
          backdropFilter: 'blur(20px)'
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '50%',
            padding: '16px',
            display: 'inline-flex',
            marginBottom: '20px'
          }}
        >
          <FiLoader size={32} color="white" />
        </motion.div>
        
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            color: COLORS.text,
            fontSize: '20px',
            fontWeight: '600',
            margin: 0
          }}
        >
          Loading Posts...
        </motion.h2>
      </motion.div>
    </motion.div>
  );

  // Show empty state
  if (!posts?.length && !isLoading) {
    return <EmptyState />;
  }

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Main posts container
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '40px',
        gap: '24px',
        padding: '0 20px',
        paddingBottom: '40px'
      }}
    >
      

      {/* Posts Grid */}
      <AnimatePresence mode="popLayout">
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              type: "spring",
              damping: 25 
            }}
            layout
            style={{ 
              width: '100%', 
              maxWidth: '500px',
              position: 'relative'
            }}
          >
            <Post 
              post={post} 
              setCurrentId={setCurrentId} 
              setShowForm={setShowForm} 
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating Action Hint */}
      {posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{
            position: 'fixed',
            bottom: '30px',
            left: '30px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 25px rgba(59, 130, 246, 0.4)`,
            cursor: 'pointer',
            zIndex: 100
          }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: '0 12px 30px rgba(59, 130, 246, 0.6)'
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MdOutlinePostAdd size={24} color="white" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Posts;