// server.js

// 1. Load environment variables from .env file at the very top
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// 2. Correctly import the database pool.
// The `db/index.js` file now handles its own connection test and logging.
// We only need to import the 'pool' object it exports.
const pool = require("./db");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes (These are all correct)
const requestRoutes = require("./routes/requestRoutes");
const authRoutes = require("./routes/authRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const profileRoutes = require("./routes/profileRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const communityRoutes = require("./routes/communityRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use("/api/ai", aiRoutes);
app.get("/ping", (req, res) => res.send("pong"));
app.use("/api/transactions", transactionRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/communitypost", communityRoutes);

app.get("/", (req, res) => {
    res.send("🌍 Welcome to the Carbon Credit API");
});

const PORT = process.env.PORT || 5000;

// 3. Start the server directly.
// The database is initialized automatically when `require("./db")` is called.
// The connection message "✅ Database connected successfully" will appear from db/index.js.
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// 4. Set up graceful shutdown logic to close the server and database pool.
const shutdown = (signal) => {
    console.log(`⚠️ Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
        console.log("✅ HTTP server closed.");
        // Use the imported 'pool' to end the database connection
        pool
            .end()
            .then(() => {
                console.log("✅ PostgreSQL pool closed");
                process.exit(0);
            })
            .catch((err) => {
                console.error("❌ Error closing PostgreSQL pool:", err.message);
                process.exit(1);
            });
    });
};

// Listen for OS signals to trigger a graceful shutdown
process.on("SIGINT", () => shutdown("SIGINT")); // Catches Ctrl+C
process.on("SIGTERM", () => shutdown("SIGTERM")); // Catches 'kill' commands
