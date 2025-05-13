import React from 'react';
import { useSelector } from 'react-redux';
import Post from './post/Post';

const Posts = ({setCurrentId ,setShowForm}) => {
  const posts = useSelector((state) => state.post);
  console.log({ post: posts, message: "posts" });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', gap: '20px' }}>
      {!posts?.length ? (
        <h1 style={{ color: '#888', textAlign: 'center', width: '100%' }}>Loading...</h1>
      ) : (
        posts.map((post) => (
          <div key={post._id} style={{ width: '100%', maxWidth: '500px' }}>
            <Post post={post} setCurrentId={setCurrentId} setShowForm={setShowForm}/>
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
