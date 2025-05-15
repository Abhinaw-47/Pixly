import React, { use, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost ,updatedPost} from '../actions/post';
import { useSelector } from 'react-redux';
const Form = ({currentId, setCurrentId,setShowForm}) => {
  const dispatch = useDispatch();
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    tags: '',
    selectedFile: '',
  });
  const post =useSelector((state)=>currentId?state.post.find((post)=>post._id===currentId):null);
const user=JSON.parse(localStorage.getItem("profile"));
  useEffect(()=>{
if(post){
  setPostData(post);
  
}
  },[post])
  const handleSubmit = (e) => {
    e.preventDefault();
    if(currentId === 0){
      dispatch(createPost({...postData,name:user?.result.name}));
    }else{
      dispatch(updatedPost(currentId,{...postData,name:user?.result.name}));
    }
     setShowForm(false);
    handleClear();
  };

  const handleClear = () => {
    setCurrentId(0);
    setPostData({ name: '', title: '', description: '', tags: '', selectedFile: '' });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '24px', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', width: '350px' }}>
       
        <input type="text" placeholder="Title" value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} />
        <input type="text" placeholder="Description" value={postData.description} onChange={(e) => setPostData({ ...postData, description: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} />
        <input type="text" placeholder="Tags (comma separated)" value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} />
        {/* <input type="file" accept="image/*,video/*" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setPostData({ ...postData, selectedFile: reader.result }); reader.readAsDataURL(file); } }} style={{ width: '100%' }} /> */}
        <input
  type="file"
  accept="image/*,video/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData({ ...postData, selectedFile: reader.result });
      };
      reader.readAsDataURL(file); // Converts to base64
    }
  }}
  style={{ width: '100%' }}
/>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: '0.3s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'} onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}>Submit</button>
        <button type="button" onClick={handleClear} style={{ width: '100%', padding: '10px', backgroundColor: '#e5e7eb', color: '#111827', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Reset</button>
      </form>
    </div>
  );
};

export default Form;
