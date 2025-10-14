const express = require("express");
const { query } = require("../db");

const router = express.Router();

const mapRequest = (row) => ({
  _id: row.id?.toString(),
  wallet: row.wallet,
  reason: row.reason,
  amount: row.amount !== null ? Number(row.amount) : null,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// POST /api/requests
router.post("/", async (req, res) => {
  try {
    const { wallet, reason, amount, status } = req.body;

    if (!wallet || typeof amount !== "number" || !Number.isFinite(amount)) {
      return res.status(400).json({ message: "Wallet and numeric amount are required" });
    }

    const result = await query(
      `INSERT INTO requests (wallet, reason, amount, status, updated_at)
       VALUES ($1, $2, $3, COALESCE($4, 'pending'), NOW())
       RETURNING *`,
      [wallet, reason ?? null, amount, status ?? null]
    );

    const request = mapRequest(result.rows[0]);
    res.status(201).json(request);
  } catch (err) {
    console.error("Error creating request:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all requests
router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM requests ORDER BY created_at DESC");
    res.json(result.rows.map(mapRequest));
  } catch (err) {
    console.error("Error fetching requests:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

const updateStatus = async (req, res, status) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid request id" });
  }

  try {
    const result = await query(
      `UPDATE requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(mapRequest(result.rows[0]));
  } catch (err) {
    console.error(`Error updating request (${status}):`, err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/requests/:id/approve
router.put("/:id/approve", async (req, res) => updateStatus(req, res, "approved"));

// PUT /api/requests/:id/reject
router.put("/:id/reject", async (req, res) => updateStatus(req, res, "rejected"));

module.exports = router;
