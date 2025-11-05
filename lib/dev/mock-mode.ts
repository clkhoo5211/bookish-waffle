// Development mode configuration for testing without wallet connection
export const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

export const MOCK_WALLET = {
  isConnected: true,
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as `0x${string}`,
  chainId: 56, // BNB Chain
  chain: {
    id: 56,
    name: 'BNB Smart Chain',
  },
  balance: {
    value: BigInt('1500000000000000000'), // 1.5 BNB
    decimals: 18,
    formatted: '1.5',
    symbol: 'BNB'
  }
};

export const MOCK_TRANSACTIONS = [
  {
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' as `0x${string}`,
    chainId: 56,
    type: 'payment' as const,
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as `0x${string}`,
    to: '0x9876543210fedcba9876543210fedcba98765432' as `0x${string}`,
    value: '50.00',
    tokenAddress: 'USDT',
    status: 'confirmed' as const,
    timestamp: Date.now() - 3600000,
    synced: true,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  },
  {
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' as `0x${string}`,
    chainId: 56,
    type: 'swap' as const,
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as `0x${string}`,
    to: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    value: '1.0',
    tokenAddress: 'BNB',
    status: 'pending' as const,
    timestamp: Date.now() - 7200000,
    synced: true,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
  },
  {
    hash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321' as `0x${string}`,
    chainId: 56,
    type: 'payment' as const,
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as `0x${string}`,
    to: '0x1111222233334444555566667777888899990000' as `0x${string}`,
    value: '25.50',
    tokenAddress: 'USDT',
    status: 'confirmed' as const,
    timestamp: Date.now() - 86400000,
    synced: true,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  }
];

export const MOCK_MERCHANT = {
  name: 'The Roasted Bean Coffee Co.',
  logo: '☕', // Placeholder emoji, replace with actual logo later
  tokenSymbol: 'TRBCC',
  tokenBalance: 150,
  supportedNetworks: ['BNB Chain', 'Ethereum', 'Polygon'],
};

