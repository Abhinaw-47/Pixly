import React, { useEffect, useRef, useState } from 'react';
import logo from '../images/logo.png';
import { Avatar } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import {  useLocation, Link } from 'react-router-dom';
import { FaChevronDown, FaSignOutAlt, FaUpload, FaSearch } from 'react-icons/fa';

const Navbar = ({ setShowForm }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
 
  const location = useLocation();
  const dropdownRef = useRef();
 

 
  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedData = jwtDecode(token);
      if (decodedData.exp * 1000 < new Date().getTime()) {
        logoutHandler();
      }
    }
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutHandler = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
    setUser(null);
    setDropdownOpen(false);
  };

  return (
    <>
      {/* Sticky Navbar */}
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
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
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
        </Link>

        {/* Auth Section */}
        <div>
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#eef2ff',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  userSelect: 'none'
                }}
              >
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
                  color: '#1f2937',
                  fontWeight: '500',
                  fontSize: '15px',
                  maxWidth: '140px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {user?.result.name}
                </span>
                <FaChevronDown size={14} color="#4f46e5" />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  minWidth: '180px',
                  zIndex: 2000
                }}>
                  <div
                    onClick={() => {
                      setShowForm(true);
                      setDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#111827',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                  >
                    <FaUpload size={14} />
                    Upload
                  </div>
                  <div
                    onClick={logoutHandler}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#b91c1c',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                  >
                    <FaSignOutAlt size={14} />
                    Logout
                  </div>
                </div>
              )}
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

      {/* Floating Search Bar */}
     
    </>
  );
};

export default Navbar;
