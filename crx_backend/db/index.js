// /db/index.js
// This file handles the database configuration and exports the connection pool.

// 1. Load environment variables from the .env file
require("dotenv").config();

// 2. Import the Pool class from the 'pg' library
const { Pool } = require("pg");

// 3. Create a configuration object using the environment variables
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // 4. Configure SSL for secure connections
    ssl: {
        // This line is the fix. It tells Node.js to allow connections to
        // databases with self-signed certificates. This is often required
        // in development environments or when behind certain network proxies.
        rejectUnauthorized: false,
    },
};

// 5. Create a new instance of the connection pool with our configuration
const pool = new Pool(dbConfig);

// 6. (Recommended) Add a connection test to provide immediate feedback on startup
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("❌ Database connection error:", err.stack);
    } else {
        console.log("✅ Database connected successfully at:", res.rows[0].now);
    }
});

// 7. Export the pool object
module.exports = pool;
