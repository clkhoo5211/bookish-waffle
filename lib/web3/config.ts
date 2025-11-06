'use client';

import { createConfig, http, type CreateConnectorFn } from 'wagmi';
import { bsc, bscTestnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect, metaMask } from 'wagmi/connectors';

// Supported chains - BSC + Sepolia
export const supportedChains = [
  bscTestnet,   // BSC Testnet
  sepolia,      // Sepolia Testnet (for Pimlico)
  bsc,          // BSC Mainnet
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
        url: typeof window !== 'undefined' ? window.location.origin : 'https://clkhoo5211.github.io/bookish-waffle',
        icons: ['https://clkhoo5211.github.io/bookish-waffle/icon-192.png'],
      },
    }),
  ];
  
  return connectorsInstance;
}

// RPC endpoints
const BSC_RPC_URLS = ['https://bsc-dataseed.binance.org'];
const BSC_TESTNET_RPC_URLS = ['https://bsc-testnet.publicnode.com'];
const SEPOLIA_RPC_URLS = ['https://eth-sepolia.g.alchemy.com/v2/demo'];

// Create wagmi config - Multiple networks
export const wagmiConfig = createConfig({
  chains: [bscTestnet, sepolia, bsc],
  connectors: createConnectors(),
  transports: {
    [bscTestnet.id]: http(BSC_TESTNET_RPC_URLS[0], { batch: true, retryCount: 3 }),
    [sepolia.id]: http(SEPOLIA_RPC_URLS[0], { batch: true, retryCount: 3 }),
    [bsc.id]: http(BSC_RPC_URLS[0], { batch: true, retryCount: 3 }),
  },
});

// Note: Reown AppKit integration will be configured separately
// when WalletConnect project ID is available

