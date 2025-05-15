import React from 'react';
import { useSelector } from 'react-redux';
import Post from './post/Post';
import { FiLoader } from 'react-icons/fi';
import { MdOutlinePostAdd } from 'react-icons/md';

const Posts = ({ setCurrentId, setShowForm }) => {
  const { posts, isLoading } = useSelector((state) => state.post);

  const centeredStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70vh',
    textAlign: 'center',
    color: '#aaa',
  };

  if (!posts?.length && !isLoading) {
    return (
      <div style={centeredStyle}>
        <MdOutlinePostAdd size={60} style={{ marginBottom: '10px' }} />
        <h2>No posts found</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ ...centeredStyle, color: '#4f46e5' }}>
        <FiLoader size={48} className="spinner" />
        <h2 style={{ marginTop: '10px' }}>Loading...</h2>
        <style>{`
          .spinner {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px', gap: '20px' }}>
      {posts.map((post) => (
        <div key={post._id} style={{ width: '100%', maxWidth: '500px' }}>
          <Post post={post} setCurrentId={setCurrentId} setShowForm={setShowForm} />
        </div>
      ))}
    </div>
  );
};

export default Posts;
