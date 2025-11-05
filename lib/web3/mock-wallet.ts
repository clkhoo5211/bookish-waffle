// Mock wallet connection for testing
export const mockWalletData = {
  isConnected: true,
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  chainId: 1,
  balance: {
    value: BigInt('1500000000000000000'), // 1.5 ETH
    decimals: 18,
    formatted: '1.5',
    symbol: 'ETH'
  }
};

export const mockTransactions = [
  {
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    chainId: 1,
    type: 'payment' as const,
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    to: '0x9876543210fedcba9876543210fedcba98765432',
    value: '0.5',
    status: 'confirmed' as const,
    timestamp: Date.now() - 3600000,
    synced: true,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  },
  {
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    chainId: 1,
    type: 'swap' as const,
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    to: '0x0000000000000000000000000000000000000000',
    value: '1.0',
    status: 'pending' as const,
    timestamp: Date.now() - 7200000,
    synced: true,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
  }
];
