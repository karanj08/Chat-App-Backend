import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/database.js";
import userRoute from "../Backend/routes/userroute.js";
import messageRoute from "../Backend/routes/messageroute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";
// import bodyParser from "body-parser";

dotenv.config({});

// app.use("/");

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const corsOption = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOption));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

server.listen(PORT, () => {
  connectDb();
  console.log(`server listen at port ${PORT}`);
});
