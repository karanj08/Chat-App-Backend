import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://chat-app-snowy-theta.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; //{userId-> socketId}

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  const userId = socket.handshake.query.userId;
  console.log(userId);

  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }
  console.log("usersocketmap", userSocketMap);

  io.emit("getonlineusers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.io);
    delete userSocketMap[userId];
    io.emit("getonlineusers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
