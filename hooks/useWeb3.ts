import { useState } from 'react';

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const mockAccount = '0x' + Math.random().toString(16).substr(2, 40);
      setAccount(mockAccount);
      setIsConnected(true);
      setBalance(57789.00);
      setNetwork('BNB Chain');
      return { success: true, account: mockAccount };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      return { success: false, error };
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setBalance(0);
    setNetwork(null);
  };

  return { account, balance, isConnected, network, connectWallet, disconnectWallet };
};

