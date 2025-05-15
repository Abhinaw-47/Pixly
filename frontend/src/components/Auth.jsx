import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaUser, FaEnvelope, FaLock, FaRedo } from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signIn,signUp } from '../actions/auth';
function Auth() {
  const [postData, setPostData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isSignUp){
      dispatch(signUp(postData, navigate));
    }else{
      dispatch(signIn(postData, navigate));
    }
  };
  

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = (res) => {
    const credential = res.credential;

      const decoded = jwtDecode(credential); // { email, name, picture, sub, ... }
    
      try {
        dispatch({ type: "AUTH", data: { result: decoded, token: credential } });
    
      navigate("/");
      } catch (error) {
        console.log(error);
      }

  };

  const handleGoogleError = (error) => {
     console.log(error)
      console.log('Google Sign In was unsuccessful. Try again later')
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  };

  const boxStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    margin: '10px 0',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  const iconInputWrapper = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    paddingLeft: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  };

  const iconStyle = {
    color: '#888',
    marginRight: '8px',
  };

  const switchTextStyle = {
    color: '#007bff',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    marginTop: '16px',
    cursor: 'pointer',
    textDecoration: 'underline',
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div style={iconInputWrapper}>
                <FaUser style={iconStyle} />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  style={{ ...inputStyle, border: 'none', margin: 0 }}
                />
              </div>
              <div style={iconInputWrapper}>
                <FaUser style={iconStyle} />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                  style={{ ...inputStyle, border: 'none', margin: 0 }}
                />
              </div>
            </>
          )}

          <div style={iconInputWrapper}>
            <FaEnvelope style={iconStyle} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              style={{ ...inputStyle, border: 'none', margin: 0 }}
            />
          </div>

          <div style={iconInputWrapper}>
            <FaLock style={iconStyle} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              style={{ ...inputStyle, border: 'none', margin: 0 }}
            />
          </div>

          {isSignUp && (
            <div style={iconInputWrapper}>
              <FaRedo style={iconStyle} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                style={{ ...inputStyle, border: 'none', margin: 0 }}
              />
            </div>
          )}

          <button type="submit" style={buttonStyle}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', margin: '15px 0', color: '#888' }}>or</div>

          <GoogleOAuthProvider clientId="617690069663-113uttoehvggjrotclm40peqv3gl9s6c.apps.googleusercontent.com">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap />
            </div>
          </GoogleOAuthProvider>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={switchTextStyle}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
