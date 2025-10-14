const express = require("express");
const { query } = require("../db");

const router = express.Router();

const mapPost = (row) => ({
  _id: row.id?.toString(),
  title: row.title,
  description: row.description,
  type: row.type,
  amount: row.amount !== null ? Number(row.amount) : null,
  wallet: row.wallet,
  createdAt: row.created_at,
});

// GET all posts
router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM community_posts ORDER BY created_at DESC");
    res.json(result.rows.map(mapPost));
  } catch (err) {
    console.error("Failed to fetch posts:", err.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// POST a new post
router.post("/", async (req, res) => {
  const { title, description, type, amount, wallet } = req.body;

  if (!type || !["buy", "sell"].includes(type)) {
    return res.status(400).json({ error: "Invalid post type" });
  }

  if (!wallet) {
    return res.status(400).json({ error: "Wallet is required" });
  }

  const parsedAmount = typeof amount === "number" ? amount : Number(amount);
  const normalizedAmount = Number.isFinite(parsedAmount) ? parsedAmount : null;

  try {
    const result = await query(
      `INSERT INTO community_posts (title, description, type, amount, wallet)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title ?? null, description ?? null, type, normalizedAmount, wallet]
    );

    res.status(201).json(mapPost(result.rows[0]));
  } catch (err) {
    console.error("Failed to create post:", err.message);
    res.status(400).json({ error: "Failed to create post" });
  }
});

module.exports = router;
