import axios from 'axios';
import {io} from 'socket.io-client';
const API=axios.create({baseURL:'http://localhost:5000'});
let socket = null;

API.interceptors.request.use((req)=>{
    if(localStorage.getItem('profile')){ 
        req.headers.Authorization=`Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
})

export const fetchPostsBySearch=(searchQuery)=>API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}`);
export const fetchPosts=(page)=>API.get(`/posts?page=${page}`);
export const createPost=(newPost)=>API.post('/posts',newPost);
export const updatedPost=(id,updatedPost)=>API.patch(`/posts/${id}`,updatedPost);
export const deletePost=(id)=>API.delete(`/posts/${id}`);
export const likePost=(id)=>API.patch(`/posts/${id}/likePost`);

export const signIn=(formData)=>API.post('/user/signin',formData);
export const signUp=(formData)=>API.post('/user/signup',formData);
export const googleSignin=(formData)=>API.post('/user/googleSignin',formData);

export const fetchUsers=()=>API.get('/messages/users');
export const getMessages=(id)=>API.get(`/messages/${id}`);
export const sendMessage=(id,formData)=>API.post(`/messages/${id}`,formData);

export const connectSocket = () => {
    const user = JSON.parse(localStorage.getItem("profile"));
      if (socket && socket.connected) return socket;
    if (!socket) {
        const token = JSON.parse(localStorage.getItem("profile"))?.token;
        socket = io("http://localhost:5000", {
            query: {
                userId:user?.result._id,
            },
        });
        
        socket.on("connect", () => {
            console.log("Connected to server");
        });
        
        
        socket.on("disconnect", () => {
            
            console.log("Disconnected from server");
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.io.opts.reconnection = false;
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;
export const isSocketConnected = () => socket?.connected || false;