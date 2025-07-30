import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Button, Chip, Dialog, DialogTitle, 
  DialogContent, DialogActions, Avatar, IconButton, Collapse,
  Menu, MenuItem, Divider 
} from '@mui/material';
import { FaThumbsUp, FaTrash, FaEdit, FaHeart, FaUser, FaChevronDown, FaChevronUp, FaComment } from 'react-icons/fa';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, getProfile, likePost } from '../../../actions/post';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUsersByIds } from '../../../api';
import CommentsSection from '../../CommentsSection';


const heartPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;

const Post = ({ post, setCurrentId, setShowForm }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('profile')));
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [likesMenuAnchor, setLikesMenuAnchor] = useState(null);
  const [usersWhoLiked, setUsersWhoLiked] = useState([]);


  const commentData = useSelector((state) => state.comments?.commentsByPost?.[post._id]);
  const currentCommentCount = commentData?.totalComments ?? post.commentCount ?? 0;

  const profileHandler = (creatorId) => {
    dispatch(getProfile({ profile: creatorId }));
    navigate(`/posts/profile/${creatorId}`);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  useEffect(() => {
    if (user?.result && post.likes) {
      setIsLiked(post.likes.includes(user.result._id));
    }
  }, [user, post.likes]);

  const fetchUsersWhoLiked = async () => {
    if (post.likes && post.likes.length > 0) {
      try {
        const { data } = await getUsersByIds(post.likes);
        const usersMap = {};
        data.data.forEach(user => {
          usersMap[user._id] = user;
        });
        const users = post.likes.map((userId) => {
          return usersMap[userId] || { _id: userId, name: 'Unknown User' };
        });
        setUsersWhoLiked(users);
      } catch (error) {
        console.error('Error fetching users who liked:', error);
      }
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    dispatch(likePost(post._id));
  };
  
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };
  
  const handleDeleteConfirm = (e) => {
    e.stopPropagation();
    dispatch(deletePost(post._id));
    setShowDeleteConfirm(false);
  };
  
  const editHandler = (e) => {
    e.stopPropagation();
    setCurrentId(post._id);
    setShowForm(true);
  };

  const toggleDescription = (e) => {
    e.stopPropagation();
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleLikesClick = (e) => {
    e.stopPropagation();
    if (post.likes && post.likes.length > 0) {
      fetchUsersWhoLiked();
      setLikesMenuAnchor(e.currentTarget);
    }
  };

  const handleLikesMenuClose = (e) => {
    if (e) e.stopPropagation();
    setLikesMenuAnchor(null);
  };

  const handleUserClick = (userId) => {
    profileHandler(userId);
    handleLikesMenuClose();
  };

  const isVideo = post.selectedFile && (post.selectedFile.startsWith('data:video') || post.selectedFile.includes('/video/') || post.selectedFile.match(/\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i));
  const isOwner = user?.result?._id === post?.creator;
  const shouldShowExpandButton = post.description && post.description.length > 100;

  const formatLikesDisplay = () => {
    if (!post.likes || post.likes.length === 0) return '';
    const currentUserId = user?.result?._id;
    const currentUserLiked = post.likes.includes(currentUserId);
    const likesCount = post.likes.length;
    if (likesCount === 1) {
      return currentUserLiked ? 'You like this' : '1 person likes this';
    }
    if (currentUserLiked) {
      const othersCount = likesCount - 1;
      return `You and ${othersCount} other${othersCount > 1 ? 's' : ''} like this`;
    }
    return `${likesCount} people like this`;
  };
   const handleCommentClick = (e) => {
    e.stopPropagation();
    
  };

  return (
    <>
      <Paper
        elevation={0}
        onClick={() => profileHandler(post.creator)}
        sx={{
          width: '100%',
          height: '100%',
          minHeight: '520px',
          maxHeight: '700px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          background: 'rgba(20, 20, 30, 0.7)',
          backdropFilter: 'blur(15px)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 10px 30px rgba(0, 255, 255, 0.2)',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, '&:hover .creator-name': { textDecoration: 'underline', textDecorationColor: '#00FFFF' } }}>
            <Avatar sx={{ bgcolor: '#00FFFF', color: '#000', width: 40, height: 40 }}>
              <FaUser />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography className="creator-name" variant="subtitle1" sx={{ fontWeight: 600, color: 'white', transition: 'all 0.2s ease' }}>
                {post.name}
              </Typography>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                {getTimeAgo(post.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Media Section */}
        <Box sx={{ position: 'relative', backgroundColor: '#000', flexShrink: 0 }}>
          <Box sx={{ height: 220 }}>
            {isVideo ? (
              <video src={post.selectedFile} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <img src={post.selectedFile} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </Box>
        </Box>

        {/* Content Section */}
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
          {/* Title */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', lineHeight: 1.4 }}>
            {post.title}
          </Typography>

          {/* Description */}
          {post.description && (
            <Box sx={{ mb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{
                flexGrow: 1,
                overflow: 'hidden',
                position: 'relative'
              }}>
                <Collapse in={isDescriptionExpanded} collapsedSize={40}>
                  <Box sx={{
                    maxHeight: isDescriptionExpanded ? '100px' : 'auto',
                    overflowY: isDescriptionExpanded ? 'auto' : 'hidden',
                    pr: isDescriptionExpanded ? 1 : 0,
                    pb: isDescriptionExpanded ? 1 : 0,
                    '&::-webkit-scrollbar': {
                      width: '4px'
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(0, 255, 255, 0.3)',
                      borderRadius: '10px'
                    }
                  }}>
                    <Typography 
                      variant="body2" 
                      color="rgba(255, 255, 255, 0.8)" 
                      sx={{ 
                        lineHeight: 1.5, 
                        whiteSpace: 'pre-wrap' 
                      }}
                    >
                      {post.description}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
              
              {shouldShowExpandButton && (
                <Box sx={{ mt: 0.5, flexShrink: 0 }}>
                  <Button
                    onClick={toggleDescription}
                    size="small"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      textTransform: 'none',
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#00FFFF'
                      }
                    }}
                    endIcon={isDescriptionExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                  >
                    {isDescriptionExpanded ? 'Show less' : 'Show more'}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 'auto', flexShrink: 0 }}>
            {post.tags.slice(0, 3).map((tag) => (
              <Chip 
                key={tag} 
                label={`#${tag}`} 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(0, 255, 255, 0.1)', 
                  color: '#00FFFF', 
                  fontWeight: 500, 
                  fontSize: '0.75rem' 
                }} 
              />
            ))}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)', flexShrink: 0 }}>
          {/* Like details section */}
          {post.likes && post.likes.length > 0 && (
            <Box 
              onClick={handleLikesClick} 
              sx={{ 
                mb: 1, 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 0.5, 
                cursor: 'pointer', 
                color: 'rgba(255, 255, 255, 0.7)', 
                '&:hover': { color: '#00FFFF' }
              }}
            >
              <Typography variant="caption">{formatLikesDisplay()}</Typography>
              {Boolean(likesMenuAnchor) ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                onClick={handleLike} 
                startIcon={
                  <Box sx={{ animation: isLiked ? `${heartPulse} 0.6s ease` : 'none' }}>
                    {isLiked ? <FaHeart color="#F87171" size={18}/> : <FaThumbsUp size={18} />}
                  </Box>
                } 
                sx={{ 
                  color: isLiked ? '#F87171' : 'rgba(255, 255, 255, 0.7)', 
                  fontWeight: 'bold', 
                  textTransform: 'none', 
                  fontSize: '0.9rem', 
                  py: 0.5, 
                  px: 1 
                }}
              >
                {post.likes?.length || 0}
              </Button>

              {/* Comment Button*/}
              <Button
                startIcon={<FaComment size={16} />}
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontWeight: 'bold', 
                  textTransform: 'none', 
                  fontSize: '0.9rem',
                  py: 0.5,
                  px: 1,
                }}
                onClick={handleCommentClick}
              >
                {currentCommentCount}
              </Button>
            </Box>
            
            <Box>
              {isOwner && (
                <>
                  <IconButton onClick={editHandler} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                    <FaEdit size={16} /> 
                  </IconButton>
                  <IconButton onClick={handleDeleteClick} sx={{ color: '#F87171', '&:hover': { backgroundColor: 'rgba(248, 113, 113, 0.1)' } }}>
                    <FaTrash size={16} />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>

          {/* Comments Section*/}
          <CommentsSection postId={post._id} initialCommentCount={currentCommentCount} />
        </Box>
      </Paper>

      {/* Likes Menu */}
      <Menu
        anchorEl={likesMenuAnchor}
        open={Boolean(likesMenuAnchor)}
        onClose={handleLikesMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{ 
          sx: { 
            background: 'rgba(20, 20, 30, 0.95)', 
            backdropFilter: 'blur(15px)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '12px', 
            color: 'white', 
            maxHeight: 300, 
            width: 250 
          }
        }}
      >
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1}}>
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 600 }}>
            Liked by
          </Typography>
          <IconButton onClick={handleLikesMenuClose} size="small" sx={{color: 'rgba(255,255,255,0.7)', '&:hover': {color: 'white'}}}>
            <CloseIcon/>
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        {usersWhoLiked.map((likeUser, index) => (
          <MenuItem 
            key={`${likeUser._id}-${index}`} 
            onClick={() => handleUserClick(likeUser._id)} 
            sx={{ py: 1.5, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }}}
          >
            <Avatar sx={{ bgcolor: '#00FFFF', color: '#000', width: 32, height: 32, mr: 1.5 }}>
              <FaUser size={14} />
            </Avatar>
            <Typography variant="body2">{likeUser.name}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)} 
        onClick={(e) => e.stopPropagation()} 
        PaperProps={{ 
          sx: { 
            borderRadius: '16px', 
            background: '#14141E', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            color: 'white' 
          }
        }}
      >
        <DialogTitle fontWeight={700}>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(false); }} 
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            sx={{ bgcolor: '#F87171', '&:hover': { bgcolor: '#B91C1C' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Post;