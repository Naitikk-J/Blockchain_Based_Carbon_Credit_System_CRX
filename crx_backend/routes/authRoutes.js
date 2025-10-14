const express = require("express");
const { query } = require("../db");

const router = express.Router();

// POST /login
router.post("/login", async (req, res) => {
  const { wallet, email } = req.body;

  if (!wallet || !email) {
    return res.status(400).json({ message: "Wallet and email are required" });
  }

  try {
    const { rows } = await query(
      "SELECT wallet, email, role FROM users WHERE LOWER(wallet) = LOWER($1) LIMIT 1",
      [wallet]
    );

    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    if (user.email !== email) {
      return res.status(400).json({ message: "Email does not match wallet. Try again." });
    }

    return res.status(200).json({
      message: "Login successful",
      role: user.role,
      wallet: user.wallet,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /signup
router.post("/signup", async (req, res) => {
  const { wallet, email, role } = req.body;

  if (!wallet || !email || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["user", "authority"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const existing = await query(
      "SELECT wallet FROM users WHERE LOWER(wallet) = LOWER($1) LIMIT 1",
      [wallet]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const inserted = await query(
      "INSERT INTO users (wallet, email, role) VALUES ($1, $2, $3) RETURNING wallet, email, role",
      [wallet, email, role]
    );

    const user = inserted.rows[0];

    return res.status(201).json({
      message: "Signup successful",
      role: user.role,
      wallet: user.wallet,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
