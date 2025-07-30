import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: true, // Allows all origins for now
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    },
});

const UserSocketMap = new Map(); 

export function getReceiverSocketId(userId) {
    return UserSocketMap.get(userId);
}

export function getOnlineUsers() {
    return Array.from(UserSocketMap.keys());
}

function addUser(userId, socketId) {
    if (userId && socketId) {
        UserSocketMap.set(userId, socketId);
        console.log(`✅ User ${userId} connected with socket ${socketId}`);
        console.log(`📊 Total online users: ${UserSocketMap.size}`);
    }
}

function removeUser(socketId) {
    let userId = null;
    
    for (const [key, value] of UserSocketMap.entries()) {
        if (value === socketId) {
            userId = key;
            break;
        }
    }
    
    if (userId) {
        UserSocketMap.delete(userId);
        console.log(`❌ User ${userId} disconnected (socket ${socketId})`);
        console.log(`📊 Total online users: ${UserSocketMap.size}`);
    }
    
    return userId;
}

io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);
    
    const userId = socket.handshake.query.userId;
    
    if (!userId || userId === 'undefined' || userId === 'null') {
        console.log("❌ No valid userId provided, disconnecting socket");
        socket.disconnect();
        return;
    }

    addUser(userId, socket.id);
    io.emit("getOnlineUsers", getOnlineUsers());

    socket.on("sendMessage", (data) => {
        const { receiverId, message, image } = data;
        const senderId = userId;
        const receiverSocketId = getReceiverSocketId(receiverId);
        
        const messageData = {
            senderId,
            receiverId, 
            message,
            image,
            timestamp: new Date().toISOString()
        };
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", messageData);
            console.log(`📨 Socket: Message sent from ${senderId} to ${receiverId}`);
        } else {
            console.log(`❌ Receiver ${receiverId} is not online`);
        }
        
        socket.emit("newMessage", messageData);
    });

    socket.on("typing", (data) => {
        const { receiverId, isTyping } = data;
        const receiverSocketId = getReceiverSocketId(receiverId);
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", {
                senderId: userId,
                isTyping
            });
        }
    });

    socket.on("disconnect", (reason) => {
        console.log(`🔌 Socket ${socket.id} disconnected: ${reason}`);
        removeUser(socket.id);
        io.emit("getOnlineUsers", getOnlineUsers());
    });

    socket.on("error", (error) => {
        console.error(`❌ Socket error for user ${userId}:`, error);
    });
});

export { io, server, app };