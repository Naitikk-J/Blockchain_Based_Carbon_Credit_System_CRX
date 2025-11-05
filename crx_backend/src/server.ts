import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { User } from "./models/User";

import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import requestRoutes from "./routes/requests";
import transactionRoutes from "./routes/transactions";
import communityRoutes from "./routes/community";
import tokenRoutes from "./routes/token";
import aiRoutes from "./routes/ai";

dotenv.config();

const app: Express = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*", // In production, you should restrict this to your frontend's URL
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/communitypost", communityRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/ai", aiRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "✅ Backend is running" });
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Periodically fetch and broadcast user data to all clients
setInterval(async () => {
  try {
    const users = await User.find({}, 'name email wallet role carbonCredits');
    io.emit('users_update', users);
  } catch (error) {
    console.error('Error fetching and broadcasting user data:', error);
  }
}, 5000); // Refresh every 5 seconds

httpServer.listen(PORT, () => {
  console.log(`🚀 CRX Backend running on http://localhost:${PORT}`);
});

export { io };
