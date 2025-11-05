'use client';

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/profile.module.css';
import { FaPen, FaSave } from 'react-icons/fa';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    wallet: '',
    bio: '',
    skills: '',
    interests: '',
    experience: '',
    carbonCredits: 0,
  });
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState('');

  const fetchWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      return accounts[0];
    }
    return '';
  };

  useEffect(() => {
    (async () => {
      const wallet = await fetchWallet();
      if (!wallet) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      fetch(`${apiUrl}/profile/${wallet}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.wallet) {
            setProfile(data);
          } else {
            setProfile({ ...profile, wallet });
          }
        })
        .catch(() => {
          setProfile({ ...profile, wallet });
        });
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setStatus('');
    try {
      const token = localStorage.getItem('crx_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const res = await fetch(`${apiUrl}/profile/${profile.wallet}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProfile(data.user);
      setEditing(false);
      setStatus('✅ Profile updated successfully.');
    } catch (err: any) {
      console.error(err);
      setStatus('❌ Update failed.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>👤 Your Profile</h2>
        <button onClick={() => setEditing(!editing)} className={styles.editButton}>
          {editing ? <FaSave /> : <FaPen />} {editing ? 'Save' : 'Edit'}
        </button>
      </div>

      {status && <p className={styles.status}>{status}</p>}

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>Name</label>
          <input name="name" value={profile.name} onChange={handleChange} disabled={!editing} />
        </div>
        <div className={styles.field}>
          <label>Email</label>
          <input name="email" value={profile.email} onChange={handleChange} disabled={!editing} />
        </div>
        <div className={styles.field}>
          <label>Wallet Address</label>
          <input value={profile.wallet} disabled />
        </div>
        <div className={styles.fieldFull}>
          <label>Green Impact Bio</label>
          <textarea name="bio" value={profile.bio} onChange={handleChange} disabled={!editing} placeholder="Share your passion for green tech..." />
        </div>
        <div className={styles.fieldFull}>
          <label>Skills</label>
          <input name="skills" value={profile.skills} onChange={handleChange} disabled={!editing} placeholder="e.g., Renewable Energy, Sustainable Agriculture" />
        </div>
        <div className={styles.fieldFull}>
          <label>Interests</label>
          <input name="interests" value={profile.interests} onChange={handleChange} disabled={!editing} placeholder="e.g., Circular Economy, Carbon Capture" />
        </div>
        <div className={styles.fieldFull}>
          <label>Experience</label>
          <textarea name="experience" value={profile.experience} onChange={handleChange} disabled={!editing} placeholder="Describe your relevant experience..." />
        </div>
      </div>
    </div>
  );
}
