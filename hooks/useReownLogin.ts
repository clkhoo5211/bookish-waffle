'use client';

import { useAccount, useChainId } from 'wagmi';
import { bsc, bscTestnet } from 'viem/chains';
import { useEffect, useState } from 'react';

/**
 * Hook to detect if user is logged in via Reown (Smart Account)
 * Returns login status and account information
 * 
 * IMPORTANT: Since we've configured the app to ONLY use Reown AppKit,
 * ANY wallet connection means the user logged in via Reown (email/social/WalletConnect)
 */
export function useReownLogin() {
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const [isSmartAccount, setIsSmartAccount] = useState(false);
  const [isReownConnected, setIsReownConnected] = useState(false);

  useEffect(() => {
    // SIMPLIFIED LOGIC:
    // Since our app is configured to ONLY use Reown AppKit for connections,
    // ANY connected wallet means the user logged in via Reown.
    // This includes:
    // - Email login via Reown → Creates Smart Account
    // - Social login (Google, Apple, X, Discord) via Reown → Creates Smart Account
    // - WalletConnect via Reown modal → External wallet
    
    // If user is connected, they MUST have used Reown AppKit
    // because that's the only provider we've configured
    const isReown = isConnected;
    
    setIsReownConnected(isReown);

    // Check if Smart Account (on BSC network with connection)
    // For social/email login, Reown creates a Smart Account automatically
    const isSmart = isReown && isConnected && 
                   (chainId === bsc.id || chainId === bscTestnet.id);

    setIsSmartAccount(isSmart);
  }, [isConnected, connector, chainId]);

  return {
    // Connection status
    isConnected,
    isReownConnected,
    isSmartAccount,
    
    // Account info
    address,
    chainId,
    connector,
    
    // Chain info
    isBSC: chainId === bsc.id || chainId === bscTestnet.id,
    isMainnet: chainId === bsc.id,
    isTestnet: chainId === bscTestnet.id,
    
    // Login requirement
    requiresReownLogin: !isReownConnected && !isConnected,
  };
}

