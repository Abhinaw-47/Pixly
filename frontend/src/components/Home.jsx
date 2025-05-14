import React, { useState } from 'react';
import Form from './Form';
import Posts from './Posts/Posts';
import { useLocation } from 'react-router-dom';

import '../App.css'
import { useEffect } from 'react';
const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  const location = useLocation();
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')));
      }, [location]);
  return (
    <div style={{ position: 'relative', padding: '20px' }}>
      {/* Upload Button at Top-Right */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        {user?.result &&(
<button
          onClick={() => setShowForm(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Upload your pic
        </button>

        )}
        
      </div>

      {/* Posts always visible */}
      <Posts setCurrentId={setCurrentId} setShowForm={setShowForm} user = {user} setUser={setUser} />

      {/* Overlay with centered form */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.3s ease-in-out'
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
            <Form currentId={currentId} setCurrentId={setCurrentId} setShowForm={setShowForm}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
