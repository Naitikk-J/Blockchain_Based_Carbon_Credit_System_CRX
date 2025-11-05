"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "../../components/WalletContext";
import styles from "../../styles/Auth.module.css";

export default function SignupPage() {
  const { address, connectWallet } = useWallet();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"authority" | "user" | null>(null);


  const handleSignup = async () => {
    if (!address) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!role) {
      alert("Please select a role to sign up.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, wallet: address, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("crx_token", data.token);
      localStorage.setItem("crx_user_role", data.user.role);
      localStorage.setItem("crx_user_wallet", data.user.wallet);

      alert(`✅ Signed up successfully as ${role}!`);
      router.push(`/dashboard/${role}`);
    } catch (err: any) {
      console.error("Signup error:", err);
      alert(`❌ Signup error: ${err.message}`);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.backgroundVideo}
      >
        <source src="/Intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className={styles.container}>
        <div className={styles.form}>
          <h1 className={styles.title}>Sign Up</h1>

          {!address ? (
            <button onClick={connectWallet} className={styles.button}>
              Connect Wallet
            </button>
          ) : (
            <>
              <p style={{ fontSize: "0.9rem", color: "#ccc" }}>
                ✅ Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </p>
              <button
                onClick={connectWallet}
                className={styles.button}
                style={{ backgroundColor: "#1a1a1a", borderColor: "#00bfff" }}
              >
                🔄 Change Account
              </button>
            </>
          )}

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setRole("authority")}
              className={styles.button}
              style={{
                backgroundColor: role === "authority" ? "#004d40" : "transparent",
              }}
            >
              Authority
            </button>
            <button
              onClick={() => setRole("user")}
              className={styles.button}
              style={{
                backgroundColor: role === "user" ? "#004d40" : "transparent",
              }}
            >
              User
            </button>
          </div>

          <button onClick={handleSignup} className={styles.button}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
