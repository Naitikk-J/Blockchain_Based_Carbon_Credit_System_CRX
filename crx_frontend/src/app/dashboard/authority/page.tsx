"use client";

import React, { useState, useEffect } from "react";
import MintToken from "../../../components/MintToken";

import styles from "../../../styles/AuthorityDashboard.module.css";
import WalletConnect from "../../../components/ConnectWalletButton";
import Navbar from "../../../components/Navbarauthority";

interface Request {
  _id: string;
  wallet: string;
  reason: string;
  amount: number;
  status: string;
}

const RequestDashboard: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("crx_token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/requests`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const data = await res.json();
        const pendingRequests = data.filter((r: Request) => r.status === "pending");
        setRequests(pendingRequests);
      } catch (error) {
        console.error("❌ Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("crx_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      await fetch(`${apiUrl}/requests/${id}/approve`, {
        method: "PUT",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      setRequests((prev) => prev.filter((req) => req._id !== id));
      alert("✅ Request approved successfully!");
    } catch (err) {
      console.error("❌ Error approving request:", err);
      alert("❌ Failed to approve request.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem("crx_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      await fetch(`${apiUrl}/requests/${id}/reject`, {
        method: "PUT",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      setRequests((prev) => prev.filter((req) => req._id !== id));
      alert("✅ Request rejected successfully!");
    } catch (err) {
      console.error("❌ Error rejecting request:", err);
      alert("❌ Failed to reject request.");
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <Navbar />

      {/* Dashboard Heading Section */}
      <section id="dashboard" className={styles.section}>
        <h1 className={styles.title}>AUTHORITY DASHBOARD</h1>
        <div className={styles.application}>
          <h2>Pending Applications</h2>
          {loading ? (
            <p>Loading requests...</p>
          ) : (
            <ul className={styles.list}>
              {requests.length === 0 ? (
                <p>No pending requests.</p>
              ) : (
                requests.map((req) => (
                  <li key={req._id} className={styles.listItem}>
                    <p><strong>Reason:</strong> {req.reason}</p>
                    <p><strong>Wallet Address:</strong> {req.wallet}</p>
                    <p><strong>Amount:</strong> {req.amount}</p>
                    <div className={styles.buttonGroup}>
                      <button
                        onClick={() => handleApprove(req._id)}
                        className={styles.approveButton}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className={styles.rejectButton}
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </section>

      {/* Mint Section */}
      <section id="mint" className={styles.section}>
        <h2>Mint CRX Tokens</h2>
        <MintToken />
      </section>

    </div>
  );
};

export default RequestDashboard;
