import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";

import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import requestRoutes from "./routes/requests";
import transactionRoutes from "./routes/transactions";
import communityRoutes from "./routes/community";
import tokenRoutes from "./routes/token";
import aiRoutes from "./routes/ai";

dotenv.config();

const app: Express = express();
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

app.listen(PORT, () => {
  console.log(`🚀 CRX Backend running on http://localhost:${PORT}`);
});
