"use client";

import React, { useEffect, useState } from "react";
import CommunityPost from "../../components/CommunityPost";
import styles from "../../styles/Community.module.css";
import { useRouter } from "next/navigation";
import WalletConnect from "../../components/ConnectWalletButton";

interface Post {
  _id?: string;
  title: string;
  description: string;
  type: string;
  amount: number;
  wallet: string;
}

export default function CommunityPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "sell",
    amount: "",
    wallet: "",
  });

  const fetchPosts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/communitypost`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("crx_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      await fetch(`${apiUrl}/communitypost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });

      setForm({
        title: "",
        description: "",
        type: "sell",
        amount: "",
        wallet: "",
      });

      alert("✅ Post submitted successfully!");
      fetchPosts();
    } catch (err) {
      console.error("Failed to submit post:", err);
      alert("❌ Failed to submit post.");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Video Background */}
      <video className={styles.videoBackground} autoPlay loop muted playsInline>
        <source src="/Background.mp4" type="video/mp4" />
      </video>

      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <h2 className={styles.logo}>CRX 🌱</h2>
        </div>
        <div className={styles.navRight}>
          <button onClick={() => router.push("/dashboard/user")} className={styles.navButton}>
            Profile
          </button>
          <button onClick={() => router.push("/new_project")} className={styles.navButton}>
            New Project
          </button>
          <button onClick={() => router.push("/walletfunction")} className={styles.navButton}>
            Wallet Functions
          </button>
          <button onClick={() => router.push("/community")} className={styles.navButton}>
            Community Page
          </button>
          <button onClick={() => router.push("/ai")} className={styles.navButton}>
            AI Prediction
          </button>
          <div className={styles.walletButton}>
            <WalletConnect />
          </div>
        </div>
      </nav>

      <h1 className={styles.heading}>🌐 Community Marketplace</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={styles.input}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={styles.textarea}
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className={styles.select}
        >
          <option value="sell">Sell</option>
          <option value="buy">Buy</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Wallet Address"
          value={form.wallet}
          onChange={(e) => setForm({ ...form, wallet: e.target.value })}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Post to Marketplace
        </button>
      </form>

      {posts.length === 0 ? (
        <p className={styles.noPosts}>No posts found.</p>
      ) : (
        posts.map((post) => <CommunityPost key={post._id} post={post} />)
      )}
    </div>
  );
}
