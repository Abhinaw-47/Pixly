import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaUser, FaEnvelope, FaLock, FaRedo } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { googleSignin, signIn, signUp } from '../actions/auth';

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
    if (isSignUp) {
      dispatch(signUp(postData, navigate));
    } else {
      dispatch(signIn(postData, navigate));
    }
  };

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = (res) => {
    const credential = res.credential;
    const decoded = jwtDecode(credential);

    try {
      dispatch(googleSignin({ token: credential, user: decoded }, navigate));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleError = (error) => {
    console.log(error);
    console.log('Google Sign In was unsuccessful. Try again later');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", damping: 25 }}
        className="w-full max-w-md"
      >
        {/* Main Auth Card */}
        <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-400">
              {isSignUp ? 'Join our community today' : 'Sign in to your account'}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* First Name */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaUser size={16} />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      onChange={handleChange}
                      className="w-full bg-gray-700/50 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-xl border border-gray-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 focus:outline-none"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaUser size={16} />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      onChange={handleChange}
                      className="w-full bg-gray-700/50 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-xl border border-gray-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 focus:outline-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FaEnvelope size={16} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                className="w-full bg-gray-700/50 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-xl border border-gray-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FaLock size={16} />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full bg-gray-700/50 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-xl border border-gray-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 focus:outline-none"
              />
            </div>

            {/* Confirm Password */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaRedo size={16} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-xl border border-gray-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 focus:outline-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800 text-gray-400">or continue with</span>
              </div>
            </div>

            {/* Google OAuth */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center"
            >
              <GoogleOAuthProvider clientId="617690069663-113uttoehvggjrotclm40peqv3gl9s6c.apps.googleusercontent.com">
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    theme="filled_blue"
                    size="large"
                    width="100%"
                  />
                </div>
              </GoogleOAuthProvider>
            </motion.div>

            {/* Switch Auth Mode */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center mt-6"
            >
              <p className="text-gray-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </motion.div>
          </motion.form>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            © 2025 Pixly by ABHINAW ANAND. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Auth;