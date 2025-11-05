"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import styles from "../styles/profile.module.css";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    wallet: "",
    blog: "",
    carbonCredits: 0,
  });
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");

  const fetchWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      return accounts[0];
    }
    return "";
  };

  useEffect(() => {
    (async () => {
      const wallet = await fetchWallet();
      if (!wallet) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      fetch(`${apiUrl}/profile/${wallet}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.wallet) {
            setProfile({
              name: data.name || "",
              email: data.email || "",
              wallet: data.wallet,
              blog: data.blog || "",
              carbonCredits: data.carbonCredits || 0,
            });
          } else {
            setProfile({
              name: `User ${wallet.slice(0, 6)}...`,
              email: `${wallet}@example.com`,
              wallet,
              blog: "",
              carbonCredits: 0,
            });
          }
        })
        .catch(() => {
          setProfile({
            name: `User ${wallet.slice(0, 6)}...`,
            email: `${wallet}@example.com`,
            wallet,
            blog: "",
            carbonCredits: 0,
          });
        });
    })();
  }, []);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  setProfile({ ...profile, [e.target.name]: e.target.value });
};

  const handleSave = async () => {
    setStatus("");
    try {
      const token = localStorage.getItem("crx_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/profile/${profile.wallet}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProfile(data.user);
      setEditing(false);
      setStatus("✅ Profile updated successfully.");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Update failed.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>👤 Profile</h2>

      <div className={styles.outerGrid}>
        <div className={styles.profileBox}>
          <label>Name</label>
          <input name="name" value={profile.name} onChange={handleChange} disabled={!editing} className={styles.input} />

          <label>Email</label>
          <input name="email" value={profile.email} onChange={handleChange} disabled={!editing} className={styles.input} />

          <label>Wallet</label>
          <input value={profile.wallet} disabled className={styles.input} />

          <div className={styles.buttons}>
            {editing ? (
              <button onClick={handleSave} className={styles.button}>Save</button>
            ) : (
              <button onClick={() => setEditing(true)} className={styles.button}>Edit</button>
            )}
          </div>

          {status && <p className={styles.status}>{status}</p>}
        </div>

        <div className={styles.blogBox}>
          <h3 className={styles.heading}>📝 My Story</h3>
          <textarea
            name="blog"
            value={profile.blog}
            onChange={handleChange}
            disabled={!editing}
            className={styles.input}
            placeholder="Enter blog link or description"
          />
        </div>
      </div>
    </div>
  );
}
