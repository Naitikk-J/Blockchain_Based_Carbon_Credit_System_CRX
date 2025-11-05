"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/TransactionHistory.module.css";
import { ethers } from "ethers";

interface Transaction {
  _id: string;
  from: string;
  to: string;
  amount: number;
  createdAt: string;
}

export default function TransactionHistory() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWalletAddress = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        return accounts[0].toLowerCase();
      }
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setError("Unable to connect wallet.");
    }
  };

  const fetchTransactions = async (wallet: string) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/transactions/${wallet}`);
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError("❌ Failed to fetch transactions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const address = await fetchWalletAddress();
      if (address) {
        setWalletAddress(address);
        fetchTransactions(address);
      }
    };
    init();
  }, []);

  return (
    <div className={styles.transactionHistoryContainer}>
      <h2 className={styles.title}>📄 Transaction History</h2>

      {error && <p className={styles.error}>{error}</p>}
      {loading ? (
        <p className={styles.loading}>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className={styles.empty}>No transactions found.</p>
      ) : (
        <ul className={styles.transactionList}>
          {transactions.map((tx) => (
            <li key={tx._id} className={styles.transactionItem}>
              <p><strong>From:</strong> {tx.from}</p>
              <p><strong>To:</strong> {tx.to}</p>
              <p><strong>Amount:</strong> {tx.amount} CRX</p>
              <p><strong>Date:</strong> {new Date(tx.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
