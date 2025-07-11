import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  Fade,
  Slide,
  Zoom,
  IconButton,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatedPost, getPosts } from '../actions/post';
import { MdOutlineBackup, MdRestartAlt, MdCloudUpload, MdImage, MdVideoLibrary, MdClose } from 'react-icons/md';
import { FaUser, FaMagic, FaRocket } from 'react-icons/fa';
import { keyframes } from '@mui/system';

const floatForm = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotateX(0deg);
  }
  25% { 
    transform: translateY(-3px) rotateX(1deg);
  }
  50% { 
    transform: translateY(-1px) rotateX(-0.5deg);
  }
  75% { 
    transform: translateY(-5px) rotateX(0.5deg);
  }
`;

const shimmerGlow = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulseSuccess = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 40px rgba(34, 197, 94, 0.6);
    transform: scale(1.02);
  }
`;

const typewriterEffect = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const Form = ({ currentId, setCurrentId, setShowForm }) => {
  const dispatch = useDispatch();
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    tags: '',
    selectedFile: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [tagArray, setTagArray] = useState([]);
  const [formVisible, setFormVisible] = useState(false);

  const post = useSelector((state) =>
    currentId ? state.post.posts.find((post) => post._id === currentId) : null
  );
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    if (post) {
      setPostData(post);
      setTagArray(Array.isArray(post.tags) ? post.tags : []);
    }
    setFormVisible(true);
  }, [post]);

  useEffect(() => {
    if (postData.tags) {
      const tagsArray = typeof postData.tags === 'string' 
        ? postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : postData.tags;
      setTagArray(tagsArray);
    }
  }, [postData.tags]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        ...postData,
        tags: tagArray,
        name: user?.result.name
      };

      if (currentId === 0) {
        await dispatch(createPost(dataToSubmit));
      } else {
        await dispatch(updatedPost(currentId, dataToSubmit));
      }

      
      await dispatch(getPosts());
      
      setShowSuccess(true);
      
      
      setTimeout(() => {
        setShowForm(false);
        handleClear();
      }, 1500);

    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setCurrentId(0);
    setPostData({ title: '', description: '', tags: '', selectedFile: '' });
    setPreviewFile(null);
    setFileType('');
    setTagArray([]);
    setShowSuccess(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileType(file.type.startsWith('image') ? 'image' : 'video');
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData({ ...postData, selectedFile: reader.result });
        setPreviewFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTag = (indexToRemove) => {
    const newTags = tagArray.filter((_, index) => index !== indexToRemove);
    setTagArray(newTags);
    setPostData({ ...postData, tags: newTags.join(',') });
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setPostData({ ...postData, tags: value });
  };

  return (
    <Fade in={formVisible} timeout={800}>
      <Box 
        sx={{ 
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
      
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                background: `rgba(139, 92, 246, ${0.3 + Math.random() * 0.4})`,
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `${sparkle} ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 650,
            maxHeight: '85vh',
            overflowY: 'auto',
            p: 4,
            borderRadius: '30px',
            background: `
              linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(31, 41, 55, 0.9)),
              linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)
            `,
            backdropFilter: 'blur(25px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            zIndex: 1,
            transformStyle: 'preserve-3d',
            animation: `${floatForm} 8s ease-in-out infinite`,
            '&:hover': {
              animation: 'none',
              transform: 'translateY(-5px) rotateX(2deg)',
            },
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
                  rgba(255, 255, 255, 0.1), 
                  transparent
                )
              `,
              animation: `${shimmerGlow} 3s ease-in-out infinite`,
            },
          }}
        >
          <IconButton
  onClick={() => {
    setShowForm(false);
    handleClear(); // Optional: also clears the form
  }}
  sx={{
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover': {
      color: 'white',
    },
  }}
>
  <MdClose size={24} />
</IconButton>

          
          {showSuccess && (
            <Fade in={showSuccess} timeout={500}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(16, 185, 129, 0.9))',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  animation: `${pulseSuccess} 1.5s ease-in-out infinite`,
                }}
              >
                <FaRocket size={60} color="white" />
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mt: 2 }}>
                  {currentId ? 'Updated!' : 'Posted!'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                  Your {currentId ? 'update' : 'post'} was successful
                </Typography>
              </Box>
            </Fade>
          )}

       
          <Slide direction="down" in={formVisible} timeout={800} style={{ transitionDelay: '200ms' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  bgcolor: 'linear-gradient(45deg, #6b21a8, #8b5cf6)',
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  mb: 2,
                  border: '3px solid rgba(255, 255, 255, 0.2)',
                  animation: `${floatForm} 6s ease-in-out infinite`,
                }}
              >
                <FaMagic size={24} />
              </Avatar>
              
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                  backgroundSize: '200% 200%',
                  animation: `${shimmerGlow} 3s ease-in-out infinite`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {currentId ? 'Edit Your Story' : 'Create Magic'}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 300,
                }}
              >
                Share your thoughts with the world
              </Typography>
            </Box>
          </Slide>

          
          {isSubmitting && (
            <Fade in={isSubmitting} timeout={300}>
              <Box sx={{ mb: 3 }}>
                <LinearProgress 
                  sx={{
                    borderRadius: 2,
                    height: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 1, display: 'block' }}>
                  {currentId ? 'Updating your post...' : 'Publishing your post...'}
                </Typography>
              </Box>
            </Fade>
          )}

          <form onSubmit={handleSubmit}>
          
            <Slide direction="up" in={formVisible} timeout={800} style={{ transitionDelay: '400ms' }}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                required
                value={postData.title}
                onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.08)',
                      transform: 'translateY(-2px)',
                    },
                    '&.Mui-focused': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.3)',
                    },
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(139, 92, 246, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#8b5cf6',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                  },
                }}
                disabled={isSubmitting}
              />
            </Slide>

           
            <Slide direction="up" in={formVisible} timeout={800} style={{ transitionDelay: '500ms' }}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                required
                value={postData.description}
                onChange={(e) => setPostData({ ...postData, description: e.target.value })}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.08)',
                      transform: 'translateY(-2px)',
                    },
                    '&.Mui-focused': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.3)',
                    },
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(139, 92, 246, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#8b5cf6',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                  },
                }}
                disabled={isSubmitting}
              />
            </Slide>

           
            <Slide direction="up" in={formVisible} timeout={800} style={{ transitionDelay: '600ms' }}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Tags (comma separated)"
                  variant="outlined"
                  fullWidth
                  value={postData.tags}
                  onChange={handleTagsChange}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.08)',
                        transform: 'translateY(-2px)',
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.3)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(139, 92, 246, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8b5cf6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: '#8b5cf6',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    },
                  }}
                  disabled={isSubmitting}
                />
                
              
                {tagArray.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {tagArray.map((tag, index) => (
                      <Zoom key={index} in timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
                        <Chip
                          label={`#${tag}`}
                          size="small"
                          onDelete={() => removeTag(index)}
                          deleteIcon={<MdClose />}
                          sx={{
                            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '12px',
                            '& .MuiChip-deleteIcon': {
                              color: 'rgba(255, 255, 255, 0.8)',
                              '&:hover': {
                                color: 'white',
                              },
                            },
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        />
                      </Zoom>
                    ))}
                  </Box>
                )}
              </Box>
            </Slide>

           
            <Slide direction="up" in={formVisible} timeout={800} style={{ transitionDelay: '700ms' }}>
              <Box sx={{ mb: 3 }}>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<MdCloudUpload />}
                  sx={{
                    py: 2,
                    borderRadius: '15px',
                    border: '2px dashed rgba(139, 92, 246, 0.5)',
                    background: 'rgba(139, 92, 246, 0.05)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: '2px dashed rgba(139, 92, 246, 0.8)',
                      background: 'rgba(139, 92, 246, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  disabled={isSubmitting}
                >
                  {previewFile ? 'Change File' : 'Upload Image or Video'}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </Button>

              
                {previewFile && (
                  <Fade in={!!previewFile} timeout={500}>
                    <Box sx={{ mt: 2, position: 'relative' }}>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: '15px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          {fileType === 'image' ? <MdImage size={24} /> : <MdVideoLibrary size={24} />}
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {fileType === 'image' ? 'Image Preview' : 'Video Preview'}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setPreviewFile(null);
                              setPostData({ ...postData, selectedFile: '' });
                            }}
                            sx={{ 
                              ml: 'auto',
                              color: 'rgba(255, 255, 255, 0.6)',
                              '&:hover': { color: 'white' },
                            }}
                          >
                            <MdClose />
                          </IconButton>
                        </Box>
                        
                        {fileType === 'image' ? (
                          <img
                            src={previewFile}
                            alt="Preview"
                            style={{
                              width: '100%',
                              maxHeight: 200,
                              objectFit: 'cover',
                              borderRadius: 8,
                            }}
                          />
                        ) : (
                          <video
                            src={previewFile}
                            controls
                            style={{
                              width: '100%',
                              maxHeight: 200,
                              borderRadius: 8,
                            }}
                          />
                        )}
                      </Paper>
                    </Box>
                  </Fade>
                )}
              </Box>
            </Slide>

           
            <Slide direction="up" in={formVisible} timeout={800} style={{ transitionDelay: '800ms' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  startIcon={<MdOutlineBackup />}
                  disabled={isSubmitting || !postData.title || !postData.description}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: '15px',
                    fontSize: '1rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4338ca, #7e22ce)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 30px rgba(147, 51, 234, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  {isSubmitting ? 'Publishing...' : (currentId ? 'Update Post' : 'Publish Post')}
                </Button>

                <Button
                  type="button"
                  startIcon={<MdRestartAlt />}
                  onClick={handleClear}
                  disabled={isSubmitting}
                  sx={{
                    py: 1.5,
                    px: 3,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 600,
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.15)',
                      transform: 'translateY(-2px)',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  Reset
                </Button>
              </Box>
            </Slide>
          </form>
        </Paper>
      </Box>
    </Fade>
  );
};

export default Form;