const express = require("express");
const { query } = require("../db");

const router = express.Router();

const mapTransaction = (row) => ({
  _id: row.id?.toString(),
  from: row.from_wallet,
  to: row.to_wallet,
  amount: row.amount !== null ? Number(row.amount) : null,
  txHash: row.tx_hash,
  createdAt: row.created_at,
});

// POST /api/transactions — Log a new transaction
router.post("/", async (req, res) => {
  try {
    const { from, to, amount, txHash } = req.body;

    if (!from || !to || typeof amount !== "number" || !Number.isFinite(amount)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await query(
      `INSERT INTO transactions (from_wallet, to_wallet, amount, tx_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [from, to, amount, txHash ?? null]
    );

    res.status(201).json(mapTransaction(result.rows[0]));
  } catch (err) {
    console.error("Error saving transaction:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/transactions/:wallet — Fetch all transactions for a wallet
router.get("/:wallet", async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();

    const result = await query(
      `SELECT * FROM transactions
       WHERE LOWER(from_wallet) = $1 OR LOWER(to_wallet) = $1
       ORDER BY created_at DESC`,
      [wallet]
    );

    res.json(result.rows.map(mapTransaction));
  } catch (err) {
    console.error("Error fetching transactions:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
