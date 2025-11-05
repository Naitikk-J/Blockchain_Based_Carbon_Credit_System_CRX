"use client";

import styles from '../../styles/Requests.module.css';

const mockRequests = [
  {
    id: 1,
    title: 'Urgent: Smart Contract Audit',
    description: 'Need a comprehensive security audit for a new DeFi protocol before mainnet launch.',
    reward: '5,000 USDC',
    requester: '0x123...abc',
  },
  {
    id: 2,
    title: 'Frontend Developer for NFT Marketplace',
    description: 'Looking for a React developer to build a responsive UI for our new NFT collection.',
    reward: '2 ETH',
    requester: '0x456...def',
  },
  {
    id: 3,
    title: 'DApp Backend Integration',
    description: 'Help integrate a Python backend with our existing decentralized application.',
    reward: '1,200 DAI',
    requester: '0x789...ghi',
  },
];

const RequestsPage = () => {
  return (
    <div className={styles.requestsContainer}>
      <h1 className={styles.title}>Open Requests</h1>
      <div className={styles.requestList}>
        {mockRequests.map(request => (
          <div key={request.id} className={styles.requestCard}>
            <h2 className={styles.requestTitle}>{request.title}</h2>
            <p className={styles.requestDescription}>{request.description}</p>
            <div className={styles.requestInfo}>
              <span>Reward: {request.reward}</span>
              <span>Requester: {request.requester}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestsPage;
