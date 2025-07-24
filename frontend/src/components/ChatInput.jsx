import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../actions/message';
import { Box, Paper, IconButton, InputBase, Tooltip, Slide } from '@mui/material';
import { MdSend, MdAttachFile, MdClose } from 'react-icons/md';

const ChatInput = () => {
  const [post, setPost] = useState({ image: '', text: '' });
  const { selectedUser } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!post.text.trim() && !post.image) return;
    dispatch(sendMessage(selectedUser._id, post));
    setPost({ image: '', text: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPost({ ...post, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const hasContent = post.text.trim() || post.image;

  return (
    <Box sx={{ p: 2, background: 'rgba(13, 13, 27, 0.7)', backdropFilter: 'blur(15px)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
      {post.image && (
        <Slide direction="up" in={!!post.image}>
          <Box sx={{ mb: 1, position: 'relative', width: '100px', height: '100px' }}>
            <IconButton onClick={() => setPost({...post, image: ''})} sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1, color: 'white', background: 'rgba(0,0,0,0.5)' }} size="small"><MdClose /></IconButton>
            <img src={post.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}/>
          </Box>
        </Slide>
      )}
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: '4px 8px', display: 'flex', alignItems: 'center', borderRadius: '20px', background: 'rgba(28, 28, 45, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Tooltip title="Attach File">
          <IconButton sx={{ p: '10px', color: 'rgba(255,255,255,0.7)' }} onClick={() => fileInputRef.current.click()}>
            <MdAttachFile />
          </IconButton>
        </Tooltip>
        <InputBase
          sx={{ ml: 1, flex: 1, color: 'white' }}
          placeholder={`Message ${selectedUser?.name}...`}
          value={post.text}
          onChange={(e) => setPost({ ...post, text: e.target.value })}
          multiline
          maxRows={4}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Tooltip title="Send">
          <span>
            <IconButton type="submit" disabled={!hasContent} sx={{ p: '10px', color: 'white', background: hasContent ? 'linear-gradient(45deg, #00FFFF, #2E73E8)' : 'rgba(255,255,255,0.1)', '&:disabled': { background: 'rgba(255,255,255,0.1)'} }}>
              <MdSend />
            </IconButton>
          </span>
        </Tooltip>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
      </Paper>
    </Box>
  );
};

export default ChatInput;