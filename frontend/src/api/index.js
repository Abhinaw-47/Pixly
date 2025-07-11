import axios from 'axios';
import {io} from 'socket.io-client';

const API = axios.create({baseURL:'http://localhost:5000'});
let socket = null;

API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')){ 
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
})

// Post API calls
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}`);
export const getProfile = (profile) => API.get(`/posts/profile/${profile}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatedPost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);

// Auth API calls
export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const googleSignin = (formData) => API.post('/user/googleSignin', formData);

// Message API calls
export const fetchUsers = () => API.get('/messages/users');
export const getMessages = (id) => API.get(`/messages/${id}`);
export const sendMessage = (id, formData) => API.post(`/messages/${id}`, formData);

// Socket Management
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

        // If socket exists but disconnected, clean it up
        if (socket) {
            console.log("Cleaning up old socket connection");
            socket.removeAllListeners();
            socket.disconnect();
            socket = null;
        }

        console.log("Creating new socket connection for user:", user.result._id);
        
        socket = io("http://localhost:5000", {
            query: {
                userId: user.result._id,
            },
            transports: ['websocket', 'polling'],
            timeout: 20000,
            forceNew: true, // Force a new connection
        });
        
        socket.on("connect", () => {
            console.log("✅ Socket connected successfully, ID:", socket.id);
            console.log("User ID:", user.result._id);
        });
        
        socket.on("connect_error", (error) => {
            console.error("❌ Socket connection error:", error);
        });
        
        socket.on("disconnect", (reason) => {
            console.log("🔌 Socket disconnected:", reason);
        });

        socket.on("error", (error) => {
            console.error("Socket error:", error);
        });
        
        return socket;
    } catch (error) {
        console.error("Error in connectSocket:", error);
        return null;
    }
};

export const disconnectSocket = () => {
    if (socket) {
        console.log("🔌 Disconnecting socket...");
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
        console.log("✅ Socket disconnected and cleaned up");
    }
};

export const getSocket = () => socket;
export const isSocketConnected = () => socket?.connected || false;

// Utility function to emit with error handling
export const emitSocketEvent = (eventName, data) => {
    if (socket && socket.connected) {
        socket.emit(eventName, data);
        return true;
    }
    console.warn(`Cannot emit ${eventName}: socket not connected`);
    return false;
};

// Utility function to listen to socket events with cleanup
export const addSocketListener = (eventName, callback) => {
    if (socket) {
        socket.off(eventName); // Remove existing listener
        socket.on(eventName, callback);
        return true;
    }
    console.warn(`Cannot add listener for ${eventName}: socket not available`);
    return false;
};