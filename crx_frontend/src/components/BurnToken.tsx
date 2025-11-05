"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import styles from "../styles/Burn.module.css";
import CRXTokenABI from "../abi/CRXToken.json";
import { useRouter } from "next/navigation";

const CONTRACT_ADDRESS = "0xb3e497afCaB81fFb7690e3157D03715F0580B391";

const BurnToken: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [burnSuccess, setBurnSuccess] = useState<boolean>(false);
  const router = useRouter();

  const handleBurn = async () => {
    setStatus("");
    setBurnSuccess(false);

    if (!amount || isNaN(Number(amount))) {
      setStatus("⚠️ Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);

      if (!window.ethereum) {
        throw new Error("🦊 Please install MetaMask");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CRXTokenABI, signer);
      const parsedAmount = ethers.parseUnits(amount, 18);

      const tx = await contract.burn(parsedAmount);
      setStatus("⏳ Burning...");
      await tx.wait();

      const token = localStorage.getItem("crx_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      await fetch(`${apiUrl}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          from: userAddress,
          to: "0x000000000000000000000000000000000000dEaD",
          amount: parseFloat(amount),
          txHash: tx.hash,
          type: "burn",
        }),
      });

      setStatus(`🔥 Burn successful! Tx Hash: ${tx.hash}`);
      setBurnSuccess(true);
      setAmount("");
    } catch (err: any) {
      console.error("Burn error:", err);
      setStatus("❌ Burn failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestFaucet = () => {
    router.push("/request-faucet");
  };

  return (
    <div className={styles.container}>
      <input
        type="number"
        placeholder="Amount to burn"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleBurn} className={styles.button} disabled={loading}>
        {loading ? "Burning..." : "Burn"}
      </button>
      {status && <p className={styles.status}>{status}</p>}
      {burnSuccess && (
        <button
          onClick={handleRequestFaucet}
          className={styles.faucetButton || styles.button}
        >
          Submit request form for project after burn    
        </button>
      )}
    </div>
  );
};

export default BurnToken;
