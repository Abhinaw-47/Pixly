import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});
export function getReceiverSocketId(userId) {
    return UserSocketMap[userId];
}   


const UserSocketMap = {};

io.on("connection", (socket) => {
    console.log("a user connected");
    const UserId = socket.handshake.query.userId;
    if (UserId) {
        UserSocketMap[UserId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(UserSocketMap));

    socket.on("disconnect", () => {
        console.log("a user disconnected");
        delete UserSocketMap[UserId];
        io.emit("getOnlineUsers", Object.keys(UserSocketMap));
    });
});
export { io, server, app };