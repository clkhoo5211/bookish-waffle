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

  const handleOnRamp = () => {
    // Show instruction if BNB
    if (token === 'BNB') {
      const proceed = confirm(
        `💡 Tip: In the payment screen, select "${token}" from the token dropdown.\n\n` +
        `The modal defaults to USDC, but you can change it to ${token}.`
      );
      if (!proceed) return;
    }
    
    // Open on-ramp view directly - let Reown handle network requirements
    openAppKit({ view: 'OnRampProviders' });
  };

  return (
    <button
      onClick={handleOnRamp}
      className={`w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-teal-600 hover:to-blue-600 transition-all ${className}`}
    >
      <CreditCard className="w-5 h-5" />
      Buy {token || 'Tokens'} with Credit Card
    </button>
  );
}

