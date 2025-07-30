import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Collapse,
  Divider,
  CircularProgress
} from '@mui/material';
import { FaUser, FaHeart, FaTrash, FaChevronDown, FaChevronUp, FaPaperPlane } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { getComments, addComment, deleteComment, likeComment } from '../actions/comment';


const CommentsSection = ({ postId, initialCommentCount = 0 }) => {
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  
  const [showComments, setShowComments] = useState(false); 
  const [user] = useState(() => JSON.parse(localStorage.getItem('profile')));

  const commentsState = useSelector((state) => state.comments?.commentsByPost?.[postId]);
  const loading = useSelector((state) => state.comments?.loading?.[postId] || false);
  const error = useSelector((state) => state.comments?.error?.[postId] || null);

  const { comments, totalComments, currentPage, hasMore } = {
    comments: commentsState?.comments || [],
    totalComments: commentsState?.totalComments ?? initialCommentCount,
    currentPage: commentsState?.currentPage || 1,
    hasMore: commentsState?.hasMore ?? false
  };

  const handleFetchComments = (page = 1) => {
    dispatch(getComments(postId, page));
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newComment.trim() || !user?.result) return;

    setSubmitting(true);
    await dispatch(addComment(postId, newComment.trim()));
    setNewComment('');
    if (!showComments) {
      setShowComments(true);
    }
    setSubmitting(false);
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId, postId));
  };

  const handleLikeComment = (commentId) => {
    dispatch(likeComment(commentId, postId));
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const toggleComments = (e) => {
    e.stopPropagation();
    if (!showComments && comments.length === 0) {
      handleFetchComments(1);
    }
    setShowComments(!showComments);
  };

  const loadMoreComments = (e) => {
    e.stopPropagation();
    handleFetchComments(currentPage + 1);
  };

  return (
    <Box sx={{ width: '100%', mt: 1 }} onClick={(e) => e.stopPropagation()}>
      {(totalComments > 0) && (
        <Button onClick={toggleComments} sx={{ color: 'rgba(255, 255, 255, 0.7)', textTransform: 'none', p: 0, mb: 1, fontSize: '0.875rem', '&:hover': { backgroundColor: 'transparent', color: '#00FFFF' } }} endIcon={showComments ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}>
          {totalComments === 1 ? 'View 1 comment' : `View all ${totalComments} comments`}
        </Button>
      )}

      {user?.result && (
        <Box sx={{ my: 2 }}>
          <Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#00FFFF', color: '#000', width: 32, height: 32 }}><FaUser size={14} /></Avatar>
            <TextField
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              variant="standard"
              fullWidth
              disabled={submitting}
              InputProps={{
                  disableUnderline: true,
                  sx: { color: 'white', fontSize: '0.9rem', p: '8px 12px', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '20px' }
              }}
            />
            {newComment.trim() && (
              <IconButton type="submit" disabled={submitting} sx={{ color: '#00FFFF' }}>
                {submitting ? <CircularProgress size={20} color="inherit"/> : <FaPaperPlane />}
              </IconButton>
            )}
          </Box>
        </Box>
      )}

      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Box sx={{
          maxHeight: '150px',
          overflowY: 'auto',
          pr: 1,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(0, 255, 255, 0.3)', borderRadius: '10px' }
        }}>
          {loading && comments.length === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} sx={{ color: '#00FFFF' }} />
            </Box>
          )}

          {comments.map((comment, index) => (
            <Box key={comment._id}>
              <Box sx={{ display: 'flex', gap: 1.5, py: 1.5 }}>
                <Avatar sx={{ bgcolor: '#00FFFF', color: '#000', width: 32, height: 32 }}><FaUser size={14} /></Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'white' }}>{comment.authorName}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>{getTimeAgo(comment.createdAt)}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', py: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{comment.text}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={(e) => { e.stopPropagation(); handleLikeComment(comment._id); }} size="small" sx={{ color: comment.likes?.includes(user?.result?._id) ? '#F87171' : 'rgba(255, 255, 255, 0.5)', '&:hover': { backgroundColor: 'rgba(248, 113, 113, 0.1)' } }}>
                      <FaHeart size={12} />
                    </IconButton>
                    {comment.likes?.length > 0 && (<Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>{comment.likes.length}</Typography>)}
                     {user?.result?._id === comment.author && (
                      <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteComment(comment._id); }} size="small" sx={{ color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#F87171', backgroundColor: 'rgba(248, 113, 113, 0.1)' } }}>
                        <FaTrash size={10} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Box>
              {index < comments.length - 1 && (<Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', ml: 6 }} />)}
            </Box>
          ))}

          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button onClick={loadMoreComments} disabled={loading} size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)', textTransform: 'none', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#00FFFF' } }}>
                {loading ? <CircularProgress size={16} /> : 'Load more'}
              </Button>
            </Box>
          )}

          {comments.length === 0 && !loading && (
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', py: 2 }}>
              No comments yet.
            </Typography>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default CommentsSection;