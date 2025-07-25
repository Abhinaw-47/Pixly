import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, Chip, LinearProgress, Fade, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatedPost, getPosts } from '../actions/post';
import { MdCloudUpload, MdRestartAlt, MdImage, MdVideoLibrary, MdClose } from 'react-icons/md';
import { FaPen, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Form = ({ currentId, setCurrentId, setShowForm }) => {
  const [postData, setPostData] = useState({ title: '', description: '', tags: '', selectedFile: null });
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fileType, setFileType] = useState('');
  const [tagArray, setTagArray] = useState([]);
  const dispatch = useDispatch();
  const post = useSelector((state) => currentId ? state.post.posts.find((p) => p._id === currentId) : null);
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    if (post) {
      setPostData({
        title: post.title,
        description: post.description,
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags,
        selectedFile: post.selectedFile
      });
      setPreviewUrl(post.selectedFile);
      setFileType(post.selectedFile?.includes('video') ? 'video' : 'image');
      setTagArray(Array.isArray(post.tags) ? post.tags : []);
    } else {
      handleClear();
    }
  }, [post, currentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    formData.append('tags', tagArray.join(','));
    formData.append('name', user?.result.name);

    try {
      // Handle file upload
      if (postData.selectedFile && typeof postData.selectedFile !== 'string') {
        // New file selected
        formData.append('selectedFile', postData.selectedFile);
      } else if (typeof postData.selectedFile === 'string') {
        // Existing file URL (for updates)
        formData.append('selectedFile', postData.selectedFile);
      }

      if (currentId) {
        await dispatch(updatedPost(currentId, formData));
      } else {
        await dispatch(createPost(formData));
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowForm(false);
        handleClear();
        dispatch(getPosts());
      }, 1500);
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setCurrentId(0);
    setPostData({ title: '', description: '', tags: '', selectedFile: null });
    setPreviewUrl('');
    setFileType('');
    setTagArray([]);
    setShowSuccess(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name, file.type);
      
      // Store the raw file object in state
      setPostData({ ...postData, selectedFile: file });
      
      // Create a temporary URL for the preview
      const objectURL = URL.createObjectURL(file);
      setPreviewUrl(objectURL);
      setFileType(file.type.startsWith('image') ? 'image' : 'video');
      
      // Clean up the previous object URL to prevent memory leaks
      return () => URL.revokeObjectURL(objectURL);
    }
  };

  const removeMedia = () => {
    setPostData({ ...postData, selectedFile: null });
    setPreviewUrl('');
    setFileType('');
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setPostData({ ...postData, tags: value });
    
    if (value.includes(',')) {
      const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag && !tagArray.includes(tag));
      setTagArray([...tagArray, ...newTags]);
      setPostData({ ...postData, tags: '' });
    }
  };

  const removeTag = (tagToRemove) => {
    setTagArray(tagArray.filter(tag => tag !== tagToRemove));
  };

  const commonTextFieldProps = {
    variant: "outlined",
    fullWidth: true,
    disabled: isSubmitting,
    InputProps: { 
      sx: { 
        color: '#fff', 
        borderRadius: '12px', 
        background: 'rgba(28, 28, 45, 0.7)', 
        backdropFilter: 'blur(10px)', 
        transition: 'all 0.3s ease', 
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 255, 255, 0.5)' }, 
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00FFFF' }, 
        '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' } 
      } 
    },
    InputLabelProps: { 
      sx: { 
        color: 'rgba(255, 255, 255, 0.7)', 
        '&.Mui-focused': { color: '#00FFFF' } 
      } 
    },
  };

  return (
    <Box sx={{ width: '100%', position: 'relative', p: { xs: 2, sm: 4 } }}>
      <IconButton 
        onClick={() => { handleClear(); setShowForm(false); }} 
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          zIndex: 10, 
          color: 'rgba(255, 255, 255, 0.7)', 
          '&:hover': { color: 'white' } 
        }}
      >
        <MdClose size={24} />
      </IconButton>

      <Fade in={showSuccess} timeout={500}>
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'linear-gradient(135deg, rgba(46, 115, 232, 0.95), rgba(0, 255, 255, 0.9))', 
          backdropFilter: 'blur(10px)', 
          borderRadius: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 10 
        }}>
          <FaCheckCircle size={60} color="white" />
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mt: 2 }}>
            {currentId ? 'Updated!' : 'Posted!'}
          </Typography>
        </Box>
      </Fade>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <FaPen size={32} style={{ color: '#00FFFF', marginBottom: '1rem' }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              mb: 1, 
              background: 'linear-gradient(45deg, #00FFFF, #FFFFFF)', 
              backgroundClip: 'text', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              {currentId ? 'Edit Your Post' : 'Create a New Post'}
            </Typography>
            <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
              Share your moments with the community.
            </Typography>
          </Box>
        </motion.div>

        {isSubmitting && (
          <LinearProgress sx={{ 
            mb: 2, 
            borderRadius: 2, 
            height: 4, 
            '& .MuiLinearProgress-bar': { background: 'linear-gradient(45deg, #00FFFF, #2E73E8)' } 
          }} />
        )}

        <TextField 
          label="Title" 
          name="title" 
          value={postData.title} 
          onChange={(e) => setPostData({ ...postData, title: e.target.value })} 
          sx={{ mb: 2 }} 
          {...commonTextFieldProps} 
        />
        
        <TextField 
          label="Description" 
          name="description" 
          multiline 
          rows={4} 
          value={postData.description} 
          onChange={(e) => setPostData({ ...postData, description: e.target.value })} 
          sx={{ mb: 2 }} 
          {...commonTextFieldProps} 
        />
        
        <TextField 
          label="Tags (add a comma after each tag)" 
          name="tags" 
          value={postData.tags} 
          onChange={handleTagsChange} 
          sx={{ mb: 1 }} 
          {...commonTextFieldProps} 
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: '40px', mb: 2 }}>
          {tagArray.map((tag) => (
            <Chip 
              key={tag} 
              label={tag} 
              onDelete={() => removeTag(tag)} 
              sx={{ 
                bgcolor: 'rgba(0, 255, 255, 0.2)', 
                color: '#00FFFF', 
                fontWeight: 500, 
                '& .MuiChip-deleteIcon': { 
                  color: '#00FFFF', 
                  '&:hover': { color: 'white' } 
                } 
              }} 
            />
          ))}
        </Box>

        <Button 
          component="label" 
          fullWidth 
          startIcon={<MdCloudUpload />} 
          sx={{ 
            border: '2px dashed rgba(0, 255, 255, 0.5)', 
            color: 'white', 
            py: 2, 
            borderRadius: '12px', 
            '&:hover': { 
              background: 'rgba(0, 255, 255, 0.1)', 
              borderColor: '#00FFFF' 
            } 
          }}
        >
          {previewUrl ? 'Change Media' : 'Upload Image or Video'}
          <input 
            type="file" 
            accept="image/*,video/*" 
            onChange={handleFileChange} 
            hidden 
          />
        </Button>

        {previewUrl && (
          <Fade in={!!previewUrl} timeout={500}>
            <Box sx={{ 
              mt: 2, 
              p: 1, 
              borderRadius: '12px', 
              background: 'rgba(28, 28, 45, 0.7)', 
              position: 'relative' 
            }}>
              <IconButton 
                onClick={removeMedia} 
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8, 
                  zIndex: 1, 
                  color: 'white', 
                  background: 'rgba(0,0,0,0.5)', 
                  '&:hover': { background: 'rgba(0,0,0,0.7)' } 
                }}
              >
                <MdClose />
              </IconButton>
              {fileType === 'image' ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ 
                    width: '100%', 
                    maxHeight: 200, 
                    objectFit: 'cover', 
                    borderRadius: 8 
                  }} 
                />
              ) : (
                <video 
                  src={previewUrl} 
                  controls 
                  style={{ 
                    width: '100%', 
                    maxHeight: 200, 
                    borderRadius: 8 
                  }} 
                />
              )}
            </Box>
          </Fade>
        )}

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            disabled={isSubmitting || !postData.title || !postData.description} 
            sx={{ 
              py: 1.5, 
              background: 'linear-gradient(45deg, #00FFFF, #2E73E8)', 
              color: '#000', 
              fontWeight: 'bold', 
              borderRadius: '12px' 
            }}
          >
            {isSubmitting ? 'Submitting...' : (currentId ? 'Update Post' : 'Publish Post')}
          </Button>
          <Button 
            onClick={handleClear} 
            disabled={isSubmitting} 
            sx={{ 
              color: 'white', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '12px' 
            }}
          >
            <MdRestartAlt />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Form;