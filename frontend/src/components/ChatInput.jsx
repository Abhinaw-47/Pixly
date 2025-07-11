import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../actions/message';
import {
  Box,
  Paper,
  IconButton,
  InputBase,
  Tooltip,
  Zoom,
  Fade,
  Slide,
  ClickAwayListener,
} from '@mui/material';
import { FaPaperPlane, FaImage, FaVideo, FaSmile } from 'react-icons/fa';
import { MdSend, MdAttachFile, MdClose } from 'react-icons/md';
import { keyframes } from '@mui/system';


const sendPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const shimmerInput = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const floatPreview = keyframes`
  0%, 100% { transform: translateY(0px) rotateY(0deg); }
  50% { transform: translateY(-5px) rotateY(2deg); }
`;

const typingDots = keyframes`
  0%, 20% { opacity: 0; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(1); }
`;

const emojiPop = keyframes`
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(-90deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const ChatInput = () => {
  const [post, setPost] = useState({ image: '', text: '' });
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const { selectedUser } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);


  const handleClickAway = () => {
    setShowEmoji(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!post.text.trim() && !post.image) return;
    
    dispatch(sendMessage(selectedUser._id, post));
    setPost({ image: '', text: '' });
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPost({ ...post, text: value });
    setIsTyping(value.length > 0);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPost({ ...post, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePreview = () => {
    setPost({ ...post, image: '' });
  };

  const addEmoji = (emoji) => {
    const cursorPosition = inputRef.current?.selectionStart || post.text.length;
    const textBefore = post.text.substring(0, cursorPosition);
    const textAfter = post.text.substring(cursorPosition);
    const newText = textBefore + emoji + textAfter;
    
    setPost({ ...post, text: newText });
    setShowEmoji(false);
    
    
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
    }, 100);
  };

  const isVideo = post.image && post.image.startsWith('data:video');
  const hasContent = post.text.trim() || post.image;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        sx={{
          px: 3,
          py: 2,
          background: `
            linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(31, 41, 55, 0.8)),
            linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)
          `,
          backdropFilter: 'blur(25px)',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `
              linear-gradient(
                90deg, 
                transparent, 
                rgba(255, 255, 255, 0.05), 
                transparent
              )
            `,
            animation: `${shimmerInput} 4s ease-in-out infinite`,
          },
        }}
      >
        
        {showEmoji && (
          <Slide direction="up" in={showEmoji} timeout={300}>
            <Paper
              elevation={10}
              sx={{
                position: 'absolute',
                bottom: '100%',
                right: 20,
                mb: 1,
                p: 2,
                borderRadius: '20px',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(25px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 1,
                minWidth: 250,
                maxHeight: 200,
                overflowY: 'auto',
                zIndex: 1000,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                  borderRadius: '10px',
                },
              }}
            >
              {[
                '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
                '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
                '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
                '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
                '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
                '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
                '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
                '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏',
                '🙌', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶',
                '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
                '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
                '✨', '🌟', '💫', '⭐', '🌠', '☄️', '💥', '🔥', '🌈', '☀️',
                '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️'
              ].map((emoji, index) => (
                <Zoom key={emoji} in timeout={200} style={{ transitionDelay: `${index * 20}ms` }}>
                  <IconButton
                    size="small"
                    onClick={() => addEmoji(emoji)}
                    sx={{
                      fontSize: '1.4rem',
                      width: 40,
                      height: 40,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      animation: `${emojiPop} 0.6s ease-out`,
                      animationDelay: `${index * 20}ms`,
                      animationFillMode: 'both',
                      '&:hover': {
                        transform: 'scale(1.4)',
                        background: 'rgba(139, 92, 246, 0.2)',
                        borderRadius: '50%',
                      },
                    }}
                  >
                    {emoji}
                  </IconButton>
                </Zoom>
              ))}
            </Paper>
          </Slide>
        )}

        
        {post.image && (
          <Slide direction="up" in={!!post.image} timeout={400}>
            <Box
              sx={{
                mb: 2,
                position: 'relative',
                display: 'inline-block',
                animation: `${floatPreview} 4s ease-in-out infinite`,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: '15px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {isVideo ? (
                  <video
                    src={post.image}
                    controls
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '120px', 
                      borderRadius: 12,
                      display: 'block',
                    }}
                  />
                ) : (
                  <img
                    src={post.image}
                    alt="preview"
                    style={{ 
                      maxWidth: '150px', 
                      maxHeight: '100px', 
                      borderRadius: 12,
                      display: 'block',
                    }}
                  />
                )}
                
                <Zoom in={!!post.image} timeout={300}>
                  <IconButton
                    size="small"
                    onClick={removePreview}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                      color: 'white',
                      width: 24,
                      height: 24,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
                        transform: 'scale(1.1) rotate(90deg)',
                      },
                    }}
                  >
                    <MdClose size={14} />
                  </IconButton>
                </Zoom>
              </Paper>
            </Box>
          </Slide>
        )}

       
        <form onSubmit={handleSubmit}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 1.5,
              borderRadius: '25px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:focus-within': {
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.5)',
                boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.2)',
                transform: 'translateY(-2px)',
              },
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.12)',
              },
            }}
          >
           
            <Tooltip title="Attach Media" arrow>
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  background: 'rgba(139, 92, 246, 0.2)',
                  mr: 1,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.3)',
                    transform: 'scale(1.1) rotate(5deg)',
                    color: 'white',
                  },
                }}
              >
                <MdAttachFile size={20} />
              </IconButton>
            </Tooltip>

           
            <InputBase
              ref={inputRef}
              sx={{
                flex: 1,
                color: 'white',
                fontSize: '1rem',
                '&::placeholder': { 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: 400,
                },
                '& .MuiInputBase-input': {
                  py: 1,
                },
              }}
              placeholder={`Message ${selectedUser?.name || 'friend'}...`}
              value={post.text}
              onChange={handleInputChange}
              multiline
              maxRows={4}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />

           
            {isTyping && (
              <Fade in={isTyping} timeout={300}>
                <Box sx={{ mx: 1, display: 'flex', gap: 0.5 }}>
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: 'rgba(139, 92, 246, 0.8)',
                        animation: `${typingDots} 1.5s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </Box>
              </Fade>
            )}

           
            <Tooltip title="Add Emoji" arrow>
              <IconButton
                onClick={() => setShowEmoji(!showEmoji)}
                sx={{
                  color: showEmoji ? '#fbbf24' : 'rgba(255, 255, 255, 0.8)',
                  mx: 0.5,
                  background: showEmoji ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#fbbf24',
                    background: 'rgba(251, 191, 36, 0.2)',
                    transform: 'scale(1.2)',
                  },
                }}
              >
                <FaSmile size={18} />
              </IconButton>
            </Tooltip>

        
            <Zoom in timeout={300}>
              <Tooltip title="Send Message" arrow>
                <span>
                  <IconButton
                    type="submit"
                    disabled={!hasContent}
                    sx={{
                      background: hasContent
                        ? 'linear-gradient(45deg, #3b82f6, #8b5cf6)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: hasContent ? 'white' : 'rgba(255, 255, 255, 0.4)',
                      width: 42,
                      height: 42,
                      ml: 1,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      animation: hasContent ? `${sendPulse} 2s ease-in-out infinite` : 'none',
                      '&:hover': {
                        background: hasContent
                          ? 'linear-gradient(45deg, #2563eb, #7c3aed)'
                          : 'rgba(255, 255, 255, 0.15)',
                        transform: hasContent ? 'scale(1.1) rotate(15deg)' : 'scale(1.05)',
                        boxShadow: hasContent 
                          ? '0 8px 25px rgba(59, 130, 246, 0.4)'
                          : '0 4px 15px rgba(255, 255, 255, 0.2)',
                      },
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    <MdSend size={20} />
                  </IconButton>
                </span>
              </Tooltip>
            </Zoom>

           
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              hidden
              onChange={handleFileSelect}
            />
          </Paper>
        </form>
      </Box>
    </ClickAwayListener>
  );
};

export default ChatInput;
        