"use client";

import { useWallet } from '../../components/WalletContext';
import styles from '../../styles/Profile.module.css';

const ProfilePage = () => {
  const { walletAddress } = useWallet();

  // Mock data for demonstration
  const mockUser = {
    username: 'Cyberpunk77',
    avatar: '/avatar.png',
    requests: 5,
    contributions: 12,
    reputation: 4.8,
    recentActivity: [
      { id: 1, description: 'Contributed to "Project X"' },
      { id: 2, description: 'Created request "Need help with Y"' },
      { id: 3, description: 'Received kudos for "Project Z"' },
    ],
  };

  if (!walletAddress) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          <p>Please connect your wallet to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <img src={mockUser.avatar} alt="User Avatar" className={styles.avatar} />
        <h2 className={styles.username}>{mockUser.username}</h2>
        <p className={styles.walletAddress}>{walletAddress}</p>

        <div className={styles.statsContainer}>
          <div className={styles.stat}>
            <h4>Requests</h4>
            <p>{mockUser.requests}</p>
          </div>
          <div className={styles.stat}>
            <h4>Contributions</h4>
            <p>{mockUser.contributions}</p>
          </div>
          <div className={styles.stat}>
            <h4>Reputation</h4>
            <p>{mockUser.reputation}/5.0</p>
          </div>
        </div>

        <div className={styles.recentActivity}>
          <h3 className={styles.sectionTitle}>Recent Activity</h3>
          {mockUser.recentActivity.map(activity => (
            <div key={activity.id} className={styles.activityItem}>
              {activity.description}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
