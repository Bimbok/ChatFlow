const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
import cors from "cors";
const { app, server } = require("./src/lib/socket");
const connectDB = require("./src/lib/db");
const authRoutes = require("./src/routes/auth.route");
const messageRoutes = require("./src/routes/message.route");

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname_backend = path.resolve();

app.set("trust proxy", 1); // Trust Render's load balancer

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // origin: process.env.FRONTEND_URL || "http://localhost:5173",
    origin: "https://one-to-one-chat-app-two.vercel.app",

    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("ChatFlow Backend is running...");
});

// Connect to Database
connectDB();

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
});
