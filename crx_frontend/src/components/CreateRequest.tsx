"use client";

import React, { useState } from "react";
import styles from "../styles/CreateRequest.module.css";

const CreateRequest: React.FC = () => {
  const [requestType, setRequestType] = useState("mint");
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet || !amount) {
      setMessage("❗ Wallet address and amount are required.");
      return;
    }

    const requestBody = {
      wallet,
      reason: reason || requestType, // fallback to request type if no custom reason
      amount: Number(amount),
      status: "pending",
    };

    try {
      const token = localStorage.getItem("crx_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const response = await fetch(`${apiUrl}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to submit request");

      await response.json();
      setMessage("✅ Request submitted successfully!");
      setWallet("");
      setAmount("");
      setReason("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit request.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>📨 Submit Token Request</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Type:
          <select
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            className={styles.select}
          >
            <option value="mint">Mint</option>
            <option value="burn">Burn</option>
          </select>
        </label>

        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Wallet Address"
          className={styles.input}
        />

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className={styles.input}
          min="1"
        />

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason or justification..."
          className={styles.textarea}
        />

        <input
          type="file"
          onChange={handleFileChange}
          className={styles.fileInput}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        />

        <button type="submit" className={styles.button}>
          Send Request
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default CreateRequest;
