import React, { useEffect, useState } from 'react'
import logo from '../images/logo.png'
import {Avatar} from '@mui/material'
import { useDispatch } from 'react-redux'
import { useNavigate ,useLocation} from 'react-router-dom'
import { Link } from 'react-router-dom'
const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
const dispatch=useDispatch()
const navigate=useNavigate()
const location=useLocation()

useEffect(() => {
  setUser(JSON.parse(localStorage.getItem("profile")));
}, [location]);

const logoutHandler=()=>{
 dispatch({type:"LOGOUT"})
 navigate("/")
 setUser(null)
}
  return (
    <div style={{color:"black",display:"flex", alignItems:"center",justifyContent:"space-between",padding:"20px", border: '1px solid #ccc',boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
        <div style={{color:"black",display:"flex", alignItems:"center",justifyContent:"center"}} >
    <h1 style={{color:"grey", fontSize:"50px"}}>Pixly</h1>
    <img src={logo} alt=""  style={{width:"90px", height:"90px"}}/>
        </div>
        <div>
            {user?(

      <div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '12px',
  backgroundColor: '#eef2ff', // light indigo background
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
}}>
  <Avatar
    sx={{
      color: 'white',
      backgroundColor: '#4f46e5', // Indigo-600
      width: 48,
      height: 48,
      fontWeight: '600',
      fontSize: '1.1rem'
    }}
    alt={user?.result.name}
  >
    {user?.result.name.charAt(0)}
  </Avatar>

  <button
    style={{
      width: '100px',
      height: '40px',
      color: '#fff',
      backgroundColor: '#4f46e5',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      boxShadow: '0 4px 10px rgba(79, 70, 229, 0.4)',
      transition: 'all 0.3s ease'
    }}
    onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'} // Indigo-700
    onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
    onClick={logoutHandler} 
  >
    Sign out
  </button>
</div>

            ):(
  
    <Link to="/auth" style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: '#4f46e5', // Indigo-600
          color: '#fff',
          padding: '12px 28px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
          fontSize: '16px',
          fontWeight: '600',
          display: 'inline-block',
          transition: 'all 0.3s ease',
          textAlign: 'center',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#4338ca'; // Indigo-700
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
  )
}

export default Navbar