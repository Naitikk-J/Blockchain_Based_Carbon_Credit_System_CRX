'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import io from 'socket.io-client';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

interface WalletContextType {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('🦊 Please install MetaMask!');
      return;
    }

    try {
      const accounts = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Make sure MetaMask is connected.');
      }

      const ethProvider = new ethers.BrowserProvider(window.ethereum as any);
      const ethSigner = await ethProvider.getSigner();
      const userAddress = await ethSigner.getAddress();

      setProvider(ethProvider);
      setSigner(ethSigner);
      setAddress(userAddress);

      console.log('✅ Wallet connected:', userAddress);
    } catch (error: any) {
      console.error('🚨 Wallet connection failed:', error?.message || error);

      if (error.code === 4001) {
        alert('⛔ You rejected the connection request.');
      } else {
        alert('❌ Wallet connection failed: ' + (error?.message || 'Unknown error'));
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', connectWallet);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', connectWallet);
        window.ethereum.removeListener('chainChanged', () => window.location.reload());
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{ address, provider, signer, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface User {
    _id: string;
    name: string;
    email: string;
    wallet?: string;
    role: 'user' | 'authority';
    carbonCredits: number;
}

interface UsersContextType {
    users: User[];
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001');

        socket.on('connect', () => {
            console.log('Socket.IO connected');
        });

        socket.on('users_update', (data: User[]) => {
            setUsers(data);
        });

        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <UsersContext.Provider value={{ users }}>
            {children}
        </UsersContext.Provider>
    );
};

export const useUsers = () => {
    const context = useContext(UsersContext);
    if (context === undefined) {
        throw new Error('useUsers must be used within a UsersProvider');
    }
    return context;
};