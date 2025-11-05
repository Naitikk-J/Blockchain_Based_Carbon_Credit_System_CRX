"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Profile from "../../../components/Profile";
import WalletConnect from "../../../components/ConnectWalletButton";
import styles from "../../../styles/Dashboard.module.css";
import { FaUser, FaProjectDiagram, FaWallet, FaUsers, FaLightbulb, FaSignOutAlt } from "react-icons/fa";

const UserDashboard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("crx_token");
      const storedUser = localStorage.getItem("crx_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "User");
      }
      if (!token) {
        alert("🚫 Unauthorized: Please login first.");
        router.push("/login");
      } else {
        setLoading(false);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("crx_token");
    localStorage.removeItem("crx_user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <main className={styles.dashboardContainer}>
      <video
        className={styles.videoBackground}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/Background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <h2 className={styles.logo}>CRX 🌱</h2>
        </div>
        <div className={styles.navRight}>
          <WalletConnect />
          <button onClick={handleLogout} className={styles.navButton}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      <div className={styles.header}>
        <h1 className={styles.title}>Welcome, {userName}!</h1>
        <p className={styles.subtitle}>Here is an overview of your account and activities.</p>
      </div>

      <div className={styles.keyStats}>
        <div className={styles.statCard}>
          <h3>Carbon Credits</h3>
          <p>1,234</p>
        </div>
        <div className={styles.statCard}>
          <h3>CRX Tokens</h3>
          <p>5,678</p>
        </div>
        <div className={styles.statCard}>
          <h3>Transactions</h3>
          <p>90</p>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionButtons}>
          <button onClick={() => router.push("/new_project")} className={styles.actionButton}>
            <FaProjectDiagram /> New Project
          </button>
          <button onClick={() => router.push("/walletfunction")} className={styles.actionButton}>
            <FaWallet /> Wallet Functions
          </button>
          <button onClick={() => router.push("/community")} className={styles.actionButton}>
            <FaUsers /> Community Page
          </button>
          <button onClick={() => router.push("/ai")} className={styles.actionButton}>
            <FaLightbulb /> AI Prediction
          </button>
        </div>
      </div>

      <div className={styles.profileSection}>
        <Profile />
      </div>
    </main>
  );
};

export default UserDashboard;
