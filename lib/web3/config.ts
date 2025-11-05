'use client';

import { createConfig, http, type CreateConnectorFn } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, base, bsc, bscTestnet } from 'wagmi/chains';
import { injected, walletConnect, metaMask } from 'wagmi/connectors';

// Supported chains - BSC Testnet FIRST for deployment/development, BSC Mainnet for production
export const supportedChains = [
  bscTestnet,   // BNB Smart Chain Testnet (Development) - PRIORITY
  bsc,          // BNB Smart Chain Mainnet (Production)
  mainnet,      // Ethereum
  polygon,      // Polygon
  arbitrum,     // Arbitrum
  optimism,     // Optimism
  base,         // Base
] as const;

// Project ID for WalletConnect/Reown
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '1478687c5ec68d46a47d17c941950005';

// Singleton connectors to prevent re-initialization
let connectorsInstance: CreateConnectorFn[] | null = null;

function createConnectors(): CreateConnectorFn[] {
  if (connectorsInstance) {
    return connectorsInstance;
  }
  
  connectorsInstance = [
    metaMask(),
    injected({ target: 'metaMask' }),
    walletConnect({ 
      projectId,
      showQrModal: true,
      metadata: {
        name: 'RVMplus Dapps',
        description: 'Progressive Web App for cryptocurrency payments',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://rvmplus.app',
        icons: ['https://rvmplus.app/icon-192.png'],
      },
    }),
  ];
  
  return connectorsInstance;
}

// BSC RPC endpoints (multiple for redundancy)
const BSC_RPC_URLS = [
  'https://bsc-dataseed.binance.org',
  'https://bsc-dataseed1.binance.org',
  'https://bsc.publicnode.com',
  'https://56.rpc.thirdweb.com',
];

// BSC Testnet RPC endpoints (use endpoints without specific ports to avoid CSP issues)
const BSC_TESTNET_RPC_URLS = [
  'https://bsc-testnet.publicnode.com',
  'https://97.rpc.thirdweb.com',
  'https://bsc-testnet-rpc.publicnode.com',
];

// Create wagmi config with singleton connectors
export const wagmiConfig = createConfig({
  chains: [bscTestnet, bsc, mainnet, polygon, arbitrum, optimism, base],
  connectors: createConnectors(),
  transports: {
    [bscTestnet.id]: http(BSC_TESTNET_RPC_URLS[0], {
      batch: true,
      retryCount: 3,
    }),
    [bsc.id]: http(BSC_RPC_URLS[0], {
      batch: true,
      retryCount: 3,
    }),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
});

// Note: Reown AppKit integration will be configured separately
// when WalletConnect project ID is available

