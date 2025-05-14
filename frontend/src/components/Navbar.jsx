import React, { useEffect, useState } from 'react';
import logo from '../images/logo.png';
import { Avatar } from '@mui/material';
import {jwtDecode} from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token= user?.token;
    if(token){
      const decodedData=jwtDecode(token)
      if(decodedData.exp*1000<new Date().getTime()){
        logoutHandler();
      }
    }
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  const logoutHandler = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
    setUser(null);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 40px',
      backgroundColor: 'white',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      {/* Logo Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={logo} alt="logo" style={{ width: '60px', height: '60px' }} />
        <h1 style={{
          color: '#4f46e5',
          fontSize: '32px',
          fontWeight: '700',
          letterSpacing: '1px',
          margin: 0
        }}>
          Pixly
        </h1>
      </div>

      {/* Auth Section */}
      <div>
        {user ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            backgroundColor: '#eef2ff', // Light indigo
            padding: '10px 16px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}>
            <Avatar
              sx={{
                backgroundColor: '#4f46e5',
                color: 'white',
                width: 42,
                height: 42,
                fontWeight: '600',
                fontSize: '1rem',
              }}
              alt={user?.result.name}
            >
              {user?.result.name.charAt(0)}
            </Avatar>
            <span style={{
              color: '#1f2937', // Gray-800
              fontWeight: '500',
              fontSize: '15px',
              maxWidth: '140px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.result.name}
            </span>
            <button
              onClick={logoutHandler}
              style={{
                backgroundColor: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link to="/auth" style={{ textDecoration: 'none' }}>
            <div
              style={{
                backgroundColor: '#4f46e5',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#4338ca';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#4f46e5';
              }}
            >
              Sign In
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
