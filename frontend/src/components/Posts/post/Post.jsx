import React from 'react';
import { FaThumbsUp, FaTrash, FaEdit } from 'react-icons/fa';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deletePost, likePost } from '../../../actions/post';

const Post = ({ post,setCurrentId ,setShowForm}) => {
const dispatch=useDispatch();

  const edithandler=()=>{ 
    setCurrentId(post._id);
    setShowForm(true);
  }
  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: '20px auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden', backgroundColor: '#fdfdfd' }}>
      <img src={post.selectedFile} alt="Post" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{post.name}</h3>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#555' }} onClick={edithandler}>
            <FaEdit /> Edit
          </button>
        </div>
        <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '4px' }}>{moment(post.createdAt).fromNow()}</p>
        <h4 style={{ margin: '12px 0 4px' }}>{post.title}</h4>
        <p style={{ color: '#555' }}>{post.description}</p>
        <p style={{ color: '#888', fontStyle: 'italic' }}>{post.tags.map(tag => `#${tag} `)}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#555' }} onClick={() => dispatch(likePost(post._id))}>
            <FaThumbsUp /> {post.likeCount} Likes
          </button>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'crimson' }} onClick={()=>dispatch(deletePost(post._id))}>
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
