'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider } from '@privy-io/react-auth';
import { wagmiAdapter, getQueryClient } from './appkit-config';
import { useState } from 'react';

interface Web3ProvidersProps {
  children: React.ReactNode;
}

export function Web3Providers({ children }: Web3ProvidersProps) {
  // Use singleton QueryClient
  const [queryClient] = useState(() => getQueryClient());
  
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
  const privyClientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || '';
  const hasValidPrivyId = privyAppId && privyAppId !== '' && privyAppId !== 'placeholder-app-id';
  
  // Enable Privy if we have a valid App ID
  const usePrivy = hasValidPrivyId;

  // Core providers (Reown AppKit + wagmi + react-query)
  const coreProviders = (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );

  // Only wrap with PrivyProvider if we have a valid Privy app ID
  if (usePrivy) {
    return (
      <PrivyProvider
        appId={privyAppId}
        clientId={privyClientId || undefined}
        config={{
          appearance: {
            theme: 'light',
            accentColor: '#14b8a6',
          },
          legal: {
            termsAndConditionsUrl: '/privacy',
            privacyPolicyUrl: '/privacy',
          },
          walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        }}
      >
        {coreProviders}
      </PrivyProvider>
    );
  }

  // Fallback: Use Reown AppKit + wagmi only
  return coreProviders;
}
