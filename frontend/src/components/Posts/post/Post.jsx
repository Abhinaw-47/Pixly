import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaTrash, FaEdit, FaHeart, FaPlay } from 'react-icons/fa';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deletePost, likePost } from '../../../actions/post';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Consistent styling constants
const COLORS = {
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  gradient: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)',
  cardBg: 'rgba(31, 41, 55, 0.9)',
  cardHover: 'rgba(55, 65, 81, 0.9)',
  text: '#ffffff',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  danger: '#ef4444',
  dangerHover: '#dc2626',
  success: '#10b981',
  overlay: 'rgba(0, 0, 0, 0.7)',
  border: 'rgba(75, 85, 99, 0.3)',
  shadow: 'rgba(0, 0, 0, 0.25)',
  glass: 'rgba(255, 255, 255, 0.05)'
};

const Post = ({ post, setCurrentId, setShowForm }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(profile) : null;
  });
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    setUser(profile ? JSON.parse(profile) : null);
  }, [location]);

  useEffect(() => {
    if (user?.result && post.likes) {
      setIsLiked(post.likes.includes(user.result._id) || post.likes.includes(user.result.googleId));
    }
  }, [user, post.likes]);

  const editHandler = () => {
    setCurrentId(post._id);
    setShowForm(true);
  };

  const handleLike = () => {
    dispatch(likePost(post._id));
  };

  const handleDelete = () => {
    dispatch(deletePost(post._id));
    setShowDeleteConfirm(false);
  };

  const isVideo = post.selectedFile?.startsWith("data:video");
  const isOwner = user?.result?.googleId === post?.creator || user?.result?._id === post?.creator;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      style={{
        width: '100%',
        maxWidth: '500px',
        margin: '20px auto',
        borderRadius: '20px',
        background: COLORS.cardBg,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${COLORS.border}`,
        boxShadow: `0 8px 32px ${COLORS.shadow}`,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Media Section */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {isVideo ? (
          <div style={{ position: 'relative' }}>
            <video
              src={post.selectedFile}
              controls
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                background: COLORS.overlay
              }}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: COLORS.overlay,
                borderRadius: '12px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FaPlay size={12} color={COLORS.text} />
              <span style={{ color: COLORS.text, fontSize: '12px', fontWeight: '500' }}>
                Video
              </span>
            </motion.div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <img
              src={post.selectedFile}
              alt="Post"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)'
              }}
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: COLORS.text,
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                marginBottom: '4px'
              }}
            >
              {post.name}
            </motion.h3>
            <p style={{
              color: COLORS.textMuted,
              fontSize: '13px',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {moment(post.createdAt).fromNow()}
            </p>
          </div>
          
          {isOwner && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={editHandler}
              style={{
                background: COLORS.glass,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '10px',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: COLORS.primary,
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              <FaEdit size={12} />
              Edit
            </motion.button>
          )}
        </div>

        {/* Title and Description */}
        <motion.h4
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            color: COLORS.text,
            fontSize: '16px',
            fontWeight: '600',
            margin: '12px 0 8px',
            lineHeight: '1.4'
          }}
        >
          {post.title}
        </motion.h4>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            color: COLORS.textSecondary,
            fontSize: '14px',
            lineHeight: '1.5',
            margin: '0 0 12px'
          }}
        >
          {post.description}
        </motion.p>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '16px'
          }}
        >
          {post.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: COLORS.text,
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              #{tag}
            </span>
          ))}
        </motion.div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: `1px solid ${COLORS.border}`
        }}>
          {/* Like Button */}
          {user?.result ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              style={{
                background: isLiked 
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                  : COLORS.glass,
                border: `1px solid ${isLiked ? 'transparent' : COLORS.border}`,
                borderRadius: '12px',
                padding: '10px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: isLiked ? COLORS.text : COLORS.textSecondary,
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              {isLiked ? <FaHeart size={14} /> : <FaThumbsUp size={14} />}
              {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
            </motion.button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: COLORS.textMuted,
              fontSize: '14px'
            }}>
              <FaHeart size={14} />
              {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
            </div>
          )}

          {/* Delete Button */}
          {isOwner && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                background: COLORS.glass,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '12px',
                padding: '10px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: COLORS.danger,
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              <FaTrash size={12} />
              Delete
            </motion.button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: COLORS.overlay,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(5px)'
            }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: COLORS.cardBg,
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '400px',
                width: '90%',
                border: `1px solid ${COLORS.border}`,
                boxShadow: `0 20px 40px ${COLORS.shadow}`
              }}
            >
              <h3 style={{ color: COLORS.text, marginBottom: '12px' }}>Delete Post</h3>
              <p style={{ color: COLORS.textSecondary, marginBottom: '20px' }}>
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    background: COLORS.glass,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: COLORS.textSecondary,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: COLORS.text,
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Post;