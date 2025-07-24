import { Server } from "socket.io";
import http from "http";
import express from "express";



// const io = new Server(server, {
//     cors: {
//         origin: ["http://localhost:5173"],
//         methods: ["GET", "POST"],
//         credentials: true
//     },
// });
let io;

const UserSocketMap = new Map(); // Using Map for better performance

// Helper functions
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
    // Find user by socket ID
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
export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173"],
            methods: ["GET", "POST"],
            credentials: true
        },
    });
    io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);
    
    // Get user ID from query params
    const userId = socket.handshake.query.userId;
    socket.on('join',(userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    })

    if (!userId || userId === 'undefined' || userId === 'null') {
        console.log("❌ No valid userId provided, disconnecting socket");
        socket.disconnect();
        return;
    }

    // Remove any existing connection for this user
    const existingSocketId = UserSocketMap.get(userId);
    if (existingSocketId && existingSocketId !== socket.id) {
        console.log(`🔄 User ${userId} has existing connection, removing old one`);
        const existingSocket = io.sockets.sockets.get(existingSocketId);
        if (existingSocket) {
            existingSocket.disconnect();
        }
        UserSocketMap.delete(userId);
    }

    // Add user to online list
    addUser(userId, socket.id);
    
    // Emit updated online users list to all clients
    const onlineUsers = getOnlineUsers();
    io.emit("getOnlineUsers", onlineUsers);
    
    // Emit user connected event
    socket.broadcast.emit("userConnected", userId);

    // Handle manual request for online users
    socket.on("getOnlineUsers", () => {
        const onlineUsers = getOnlineUsers();
        console.log(`📤 Sending online users to ${userId}:`, onlineUsers);
        socket.emit("getOnlineUsers", onlineUsers);
    });

    // Handle user manually adding themselves (for reconnection scenarios)
    socket.on("addUser", (userIdFromClient) => {
        if (userIdFromClient && userIdFromClient !== userId) {
            console.log(`🔄 User ID mismatch: expected ${userId}, got ${userIdFromClient}`);
        }
        
        addUser(userId, socket.id);
        const onlineUsers = getOnlineUsers();
        io.emit("getOnlineUsers", onlineUsers);
    });

    // Handle private messaging
    socket.on("sendMessage", (data) => {
        const { receiverId, message } = data;
        const receiverSocketId = getReceiverSocketId(receiverId);
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", {
                senderId: userId,
                message,
                timestamp: new Date().toISOString()
            });
            console.log(`📨 Message sent from ${userId} to ${receiverId}`);
        } else {
            console.log(`❌ Receiver ${receiverId} is not online`);
        }
    });


    // Handle disconnect
    socket.on("disconnect", (reason) => {
        console.log(`🔌 Socket ${socket.id} disconnected: ${reason}`);
        
        const disconnectedUserId = removeUser(socket.id);
        
        if (disconnectedUserId) {
            // Emit updated online users list to all remaining clients
            const onlineUsers = getOnlineUsers();
            socket.broadcast.emit("getOnlineUsers", onlineUsers);
            
            // Emit user disconnected event
            socket.broadcast.emit("userDisconnected", disconnectedUserId);
        }
    });

    // Handle errors
    socket.on("error", (error) => {
        console.error(`❌ Socket error for user ${userId}:`, error);
    });
  
});
// Cleanup on server shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Server shutting down, cleaning up sockets...');
    UserSocketMap.clear();
    io.close();
});

process.on('SIGINT', () => {
    console.log('🛑 Server interrupted, cleaning up sockets...');
    UserSocketMap.clear();
    io.close();
});

    return io
    
}


export const getIO=()=>{
    if(!io){
        throw new Error("Socket.io not initialized");
    }
    return io;
}



export { io};