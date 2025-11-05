"use client";

import React, { useState } from "react";
import styles from "../styles/Mint.module.css";

const MintToken: React.FC = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    setStatus("");
    if (!recipient || !amount) {
      setStatus("⚠️ All fields are required.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("crx_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const response = await fetch(`${apiUrl}/token/mint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ to: recipient, amount: parseFloat(amount) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Minting failed, please try again.");
      }

      setStatus(`✅ Minted successfully! Transaction Hash: ${data.txHash}`);
      setRecipient("");
      setAmount("");
    } catch (err: any) {
      console.error("Minting error:", err);
      setStatus("❌ Minting failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className={styles.input}
      />
      <input
        type="number"
        placeholder="Amount to mint"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleMint} className={styles.button} disabled={loading}>
        {loading ? "Minting..." : "Mint"}
      </button>
      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
};

export default MintToken;
