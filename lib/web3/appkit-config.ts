'use client';

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { bsc, bscTestnet } from '@reown/appkit/networks';
import type { AppKitNetwork } from '@reown/appkit/networks';
import { QueryClient } from '@tanstack/react-query';

// Project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '1478687c5ec68d46a47d17c941950005';

// Metadata for WalletConnect modal
const metadata = {
  name: 'RVMplus Dapps',
  description: 'Progressive Web App for cryptocurrency payments and loyalty rewards',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://clkhoo5211.github.io/bookish-waffle',
  icons: ['https://clkhoo5211.github.io/bookish-waffle/icon-192.png'],
};

// Networks - ONLY BNB Smart Chain (Mainnet + Testnet)
// This restricts the Reown AppKit modal to show ONLY BSC networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [bsc, bscTestnet];

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

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// Create AppKit modal instance
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false, // Disabled to prevent ad blocker console errors
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#14b8a6', // Teal accent color
    '--w3m-border-radius-master': '16px',
  },
});
