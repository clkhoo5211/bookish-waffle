'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';
import { useAppKit } from '@reown/appkit/react';
import { useChainId } from 'wagmi';
import { bsc, bscTestnet, sepolia, mainnet } from 'viem/chains';

interface OnRampButtonProps {
  token?: string;
  amount?: string;
  className?: string;
}

/**
 * On-Ramp Button Component
 * Opens Reown AppKit on-ramp modal for purchasing tokens with credit card
 */
export function OnRampButton({ token, amount, className = '' }: OnRampButtonProps) {
  const { open: openAppKit } = useAppKit();
  const chainId = useChainId();
  
  const isTestnet = chainId === bscTestnet.id || chainId === sepolia.id;

  const handleOnRamp = () => {
    if (isTestnet) {
      alert('⚠️ On-ramp only works on MAINNET.\n\n' +
            'To buy with credit card:\n' +
            '1. Switch to BSC Mainnet in your wallet\n' +
            '2. Click the button again\n\n' +
            'For testnet testing, use the faucet instead (free!)');
      return;
    }
    
    // Open on-ramp view specifically
    openAppKit({ view: 'OnRampProviders' });
  };

  return (
    <button
      onClick={handleOnRamp}
      className={`w-full bg-gradient-to-r ${isTestnet ? 'from-gray-400 to-gray-500' : 'from-teal-500 to-blue-500'} text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:${isTestnet ? 'from-gray-500 to-gray-600' : 'from-teal-600 to-blue-600'} transition-all ${className}`}
    >
      <CreditCard className="w-5 h-5" />
      Buy {token || 'Tokens'} with Credit Card {isTestnet ? '(Mainnet Only)' : ''}
    </button>
  );
}

