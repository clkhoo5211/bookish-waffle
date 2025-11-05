'use client';

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { bsc, bscTestnet, mainnet, polygon, arbitrum, optimism, base } from '@reown/appkit/networks';
import { QueryClient } from '@tanstack/react-query';

// Project ID for Reown AppKit
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '1478687c5ec68d46a47d17c941950005';

// Metadata for the dApp
const metadata = {
  name: 'RVMplus Dapps',
  description: 'Progressive Web App for cryptocurrency payments and loyalty rewards',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://clkhoo5211.github.io/bookish-waffle',
  icons: ['https://clkhoo5211.github.io/bookish-waffle/icon-192.png'],
};

// Networks - BSC Testnet FIRST for default
const networks = [bscTestnet, bsc, mainnet, polygon, arbitrum, optimism, base];

// QueryClient singleton
let queryClientInstance: QueryClient | null = null;
export function getQueryClient() {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    });
  }
  return queryClientInstance;
}

// Wagmi Adapter with custom RPC endpoints
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// Create AppKit modal
if (typeof window !== 'undefined') {
  createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    features: {
      analytics: true,
      email: false, // Disable email login (using Privy for this)
      socials: false, // Disable social logins (using Privy for this)
      emailShowWallets: false,
    },
    themeMode: 'light',
    themeVariables: {
      '--w3m-accent': '#14b8a6', // Teal color
      '--w3m-border-radius-master': '16px',
    },
  });
}

