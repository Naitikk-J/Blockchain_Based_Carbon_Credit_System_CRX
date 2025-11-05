"use client";

import React, { useState } from "react";
import styles from "../styles/BalanceChecker.module.css";

const BalanceChecker: React.FC = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckBalance = async () => {
    setError(null);
    setBalance(null);

    if (!address || address.length !== 42) {
      setError("⚠️ Please enter a valid wallet address.");
      return;
    }

    try {
      setLoading(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/token/balance/${address}`);

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Invalid response: ${text}`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch balance");
      }

      setBalance(`${data.balance} CRX`);
    } catch (err: any) {
      console.error("Error fetching balance:", err);
      setError("❌ Failed to fetch balance. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>🔍 Check Token Balance</h2>

      <input
        type="text"
        className={styles.input}
        placeholder="Enter wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button onClick={handleCheckBalance} className={styles.button} disabled={loading}>
        {loading ? "Checking..." : "Check Balance"}
      </button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      {balance && <p className={styles.balance}>Balance: {balance}</p>}
    </div>
  );
};

export default BalanceChecker;
