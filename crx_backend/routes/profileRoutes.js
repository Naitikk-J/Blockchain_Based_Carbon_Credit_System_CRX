const express = require("express");
const { query } = require("../db");

const router = express.Router();

const mapProfile = (row) => ({
  wallet: row.wallet,
  name: row.name ?? "",
  email: row.email ?? "",
  organization: row.organization ?? "",
  country: row.country ?? "",
  specialization: row.specialization ?? "",
  blog: row.blog ?? "",
  carbonCredits: row.carbon_credits !== null ? Number(row.carbon_credits) : 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// GET /api/profile/:wallet
router.get("/:wallet", async (req, res) => {
  try {
    const { wallet } = req.params;
    const existing = await query(
      "SELECT * FROM profiles WHERE LOWER(wallet) = LOWER($1) LIMIT 1",
      [wallet]
    );

    if (existing.rows.length > 0) {
      return res.json(mapProfile(existing.rows[0]));
    }

    const created = await query(
      `INSERT INTO profiles (wallet, updated_at)
       VALUES ($1, NOW())
       RETURNING *`,
      [wallet]
    );

    res.json(mapProfile(created.rows[0]));
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/profile/:wallet
router.put("/:wallet", async (req, res) => {
  try {
    const { wallet } = req.params;
    const {
      name = null,
      email = null,
      organization = null,
      country = null,
      specialization = null,
      blog = null,
      carbonCredits = null,
    } = req.body;

    const result = await query(
      `INSERT INTO profiles (wallet, name, email, organization, country, specialization, blog, carbon_credits, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (wallet) DO UPDATE SET
         name = EXCLUDED.name,
         email = EXCLUDED.email,
         organization = EXCLUDED.organization,
         country = EXCLUDED.country,
         specialization = EXCLUDED.specialization,
         blog = EXCLUDED.blog,
         carbon_credits = EXCLUDED.carbon_credits,
         updated_at = NOW()
       RETURNING *`,
      [
        wallet,
        name,
        email,
        organization,
        country,
        specialization,
        blog,
        carbonCredits !== null && carbonCredits !== undefined ? Number(carbonCredits) : null,
      ]
    );

    res.json(mapProfile(result.rows[0]));
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
