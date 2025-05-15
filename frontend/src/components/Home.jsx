import React, { useState } from 'react';
import Form from './Form';
import Posts from './Posts/Posts';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../App.css'
import { useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getPostsBySearch } from '../actions/post';
import { useNavigate} from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const Home = ({showForm, setShowForm}) => {
  const dispatch = useDispatch();
  const [currentId, setCurrentId] = useState(0);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
   const query = useQuery();

  const page=query.get('page')||1
  const searchQuery=query.get('searchQuery')
 const [search, setSearch] = useState('');
const navigate = useNavigate();

  const handleSearch = () => {
    if (search.trim()) {
      dispatch(getPostsBySearch({ search }));
      navigate(`/search?searchQuery=${search || 'none'}`);
    }else{
      navigate('/');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
   useEffect(() => {
    if (searchQuery) {
      dispatch(getPostsBySearch({ search: searchQuery }));
    }
  }, [dispatch, searchQuery]);
  
  const location = useLocation();
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')));
      }, [location]);
  return (
  <div style={{ position: 'relative', padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
 <div style={{
        marginTop: '10px',
        position: 'fixed',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        backgroundColor: '#ffffff',
        padding: '8px 16px',
        borderRadius: '9999px',
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '300px',
      }}>
        <input
          type="text"
          placeholder="Search Posts"
          value={search}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            fontSize: '15px',
            width: '100%',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: '#4f46e5',
            border: 'none',
            borderRadius: '50%',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FaSearch size={16} color="white" />
        </button>
      </div>

    <Posts setCurrentId={setCurrentId} setShowForm={setShowForm} />

    {showForm && (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '500px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
        }}>
          <div style={{ textAlign: 'right' }}>
            <button onClick={() => setShowForm(false)} style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#999'
            }}>✖</button>
          </div>
          <Form currentId={currentId} setCurrentId={setCurrentId} setShowForm={setShowForm} />
        </div>
      </div>
    )}

    <div style={{
      marginTop: '60px',
      textAlign: 'center',
      color: '#9ca3af',
      fontSize: '14px',
    }}>
      © 2025 Pixly by ABHINAW ANAND. All rights reserved.
    </div>
  </div>
);

};

export default Home;
