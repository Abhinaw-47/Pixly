import axios from 'axios';
import {io} from 'socket.io-client';
import { logout } from '../utils/logout';
const API = axios.create({baseURL:import.meta.env.VITE_BACKEND_URL});
let socket = null;
let connectionAttempt = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

API.interceptors.request.use((req) => {
     const profile=JSON.parse(localStorage.getItem('profile'));
    if(profile?.accessToken){ 
        req.headers.Authorization=`Bearer ${profile.accessToken}`;
    }
    return req;
})
API.interceptors.response.use((res)=>res,
async(error)=>{
  const originalRequest=error.config;
  if(error.response?.status===401&& !originalRequest._retry){
     originalRequest._retry=true;
     try {
        const profile=JSON.parse(localStorage.getItem('profile'));
        const {refreshToken}=profile;
        const {data}=await API.post('/user/refreshToken',{token:refreshToken});
        const updatedProfile={...profile,accessToken:data.accessToken};
        localStorage.setItem('profile',JSON.stringify(updatedProfile));
        originalRequest.headers['Authorization']=`Bearer ${data.accessToken}`;
        API.defaults.headers.common['Authorization']=`Bearer ${data.accessToken}`;
        return API(originalRequest);
     } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        logout();
        return Promise.reject(refreshError);
     } 
  } 
  return Promise.reject(error); 
})


// Post API calls
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}`);
export const getProfile = (profile) => API.get(`/posts/profile/${profile}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatedPost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const getLikedPosts = () => API.get('/posts/likes');

// Auth API calls
export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const googleSignin = (formData) => API.post('/user/googleSignin', formData);
// Comment API calls
export const getComments = (postId, page = 1) => API.get(`/comments/${postId}?page=${page}&limit=10`);
export const addComment = (postId, text) => API.post(`/comments/${postId}`, { text });
export const deleteComment = (commentId) => API.delete(`/comments/${commentId}`);
export const likeComment = (commentId) => API.patch(`/comments/${commentId}/like`);
// Message API calls
export const fetchUsers = () => API.get('/messages/users');
export const getMessages = (id) => API.get(`/messages/${id}`);
export const sendMessage = (id, formData) => API.post(`/messages/${id}`, formData);
export const getUsersByIds = (userIds) => API.post('/user/users/batch', { userIds });

export const getNotifications = () => API.get('/notifications');

export const markNotificationAsRead = (id) => API.patch(`/notifications/${id}/read`);

export const fetchAllMessages = () => API.get('/messages');


let isConnecting = false;

export const connectSocket = () => {
    try {
        const profile = localStorage.getItem("profile");
        if (!profile) {
            console.log("No profile found, cannot connect socket");
            return null;
        }

        const user = JSON.parse(profile);
        if (!user?.result?._id) {
            console.log("No user ID found, cannot connect socket");
            return null;
        }

        // If socket exists and is connected, return it
        if (socket && socket.connected) {
            console.log("Socket already connected, reusing connection");
            return socket;
        }

        // If already connecting, return the existing socket
        if (isConnecting && socket) {
            console.log("Socket connection already in progress, returning existing socket");
            return socket;
        }

        // If socket exists but disconnected, clean it up
        if (socket) {
            console.log("Cleaning up old socket connection");
            socket.removeAllListeners();
            socket.disconnect();
            socket = null;
        }

        console.log("Creating new socket connection for user:", user.result._id);
        isConnecting = true;
        
        socket = io(import.meta.env.VITE_BACKEND_URL, {
            query: {
                userId: user.result._id,
            },
            transports: ['polling', 'websocket'], // Try polling first, then websocket
            timeout: 20000,
            reconnection: true,
            reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
            reconnectionDelay: 1000,
            autoConnect: true,
        });
        
        socket.on("connect", () => {
            console.log("✅ Socket connected successfully, ID:", socket.id);
            console.log("User ID:", user.result._id);
            connectionAttempt = 0; // Reset connection attempts on successful connection
            isConnecting = false;
            
            
            socket.emit('join', user.result._id);
            console.log(`📡 Joined room for user: ${user.result._id}`);
        });
        
        socket.on("connect_error", (error) => {
            connectionAttempt++;
            console.error(`❌ Socket connection error (attempt ${connectionAttempt}):`, error);
            
            if (connectionAttempt >= MAX_RECONNECT_ATTEMPTS) {
                console.error("Max reconnection attempts reached, giving up");
                isConnecting = false;
                disconnectSocket();
            }
        });
        
        socket.on("disconnect", (reason) => {
            console.log("🔌 Socket disconnected:", reason);
            isConnecting = false;
            
            
            if (reason === "io client disconnect" || reason === "io server disconnect") {
                console.log("Disconnection was intentional, not attempting to reconnect");
            }
        });

        socket.on("reconnect", (attemptNumber) => {
            console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
            connectionAttempt = 0;
            isConnecting = false;
            
           
            const currentProfile = localStorage.getItem("profile");
            if (currentProfile) {
                const currentUser = JSON.parse(currentProfile);
                if (currentUser?.result?._id) {
                    socket.emit('join', currentUser.result._id);
                    // Request online users after reconnection
                    setTimeout(() => {
                        if (socket && socket.connected) {
                            socket.emit('getOnlineUsers');
                        }
                    }, 500);
                    console.log(`📡 Re-joined room for user: ${currentUser.result._id}`);
                }
            }
        });

        socket.on("error", (error) => {
            console.error("Socket error:", error);
        });
        
        return socket;
    } catch (error) {
        console.error("Error in connectSocket:", error);
        isConnecting = false;
        return null;
    }
};

export const disconnectSocket = () => {
    if (socket) {
        console.log("🔌 Disconnecting socket...");
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
        connectionAttempt = 0;
        isConnecting = false;
        console.log("✅ Socket disconnected and cleaned up");
    }
};

export const getSocket = () => socket;
export const isSocketConnected = () => socket?.connected || false;


export const emitSocketEvent = (eventName, data) => {
    return new Promise((resolve) => {
       
        if (socket && socket.connected) {
            socket.emit(eventName, data);
            console.log(`📡 Emitted ${eventName}:`, data);
            resolve(true);
            return;
        }

       
        console.log(`Socket not connected, attempting to connect before emitting ${eventName}`);
        const connectedSocket = connectSocket();
        
        if (!connectedSocket) {
            console.warn(`Failed to connect socket for ${eventName}`);
            resolve(false);
            return;
        }

        const checkConnection = () => {
            if (connectedSocket.connected) {
                connectedSocket.emit(eventName, data);
                console.log(`📡 Emitted ${eventName} after connection:`, data);
                resolve(true);
            } else {
                // Try again after a short delay
                setTimeout(checkConnection, 100);
            }
        };

        // Start checking for connection
        checkConnection();

        // Timeout after 5 seconds
        setTimeout(() => {
            if (!connectedSocket.connected) {
                console.warn(`Timeout waiting for connection to emit ${eventName}`);
                resolve(false);
            }
        }, 5000);
    });
};


export const addSocketListener = (eventName, callback) => {
    if (socket) {
        socket.off(eventName); 
        socket.on(eventName, callback);
        console.log(`👂 Added listener for ${eventName}`);
        return true;
    }
    console.warn(`Cannot add listener for ${eventName}: socket not available`);
    return false;
};


export const waitForSocketConnection = (timeout = 5000) => {
    return new Promise((resolve, reject) => {
        if (socket && socket.connected) {
            resolve(socket);
            return;
        }

        const checkConnection = () => {
            if (socket && socket.connected) {
                resolve(socket);
            } else {
                setTimeout(checkConnection, 100);
            }
        };

        checkConnection();

        setTimeout(() => {
            reject(new Error('Socket connection timeout'));
        }, timeout);
    });
};