'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useAppKit } from '@reown/appkit/react';

interface ReownSwapButtonProps {
  toToken?: string; // Token symbol to swap TO (e.g., 'BNB', 'USDT')
  className?: string;
}

/**
 * Reown Swap Button Component
 * Opens Reown AppKit swap modal for exchanging tokens
 * Pre-configures the "TO" token so users can swap FROM any token they have
 */
export function ReownSwapButton({ toToken, className = '' }: ReownSwapButtonProps) {
  const { open: openAppKit } = useAppKit();

  const handleSwap = () => {
    // Map common token names to their standard symbols
    const tokenMap: { [key: string]: string } = {
      'BNB': 'BNB',
      'USDT': 'USDT',
      'USDC': 'USDC',
      'USD1': 'USDC', // Map USD1 to USDC for swap compatibility
    };

    const outputToken = toToken ? (tokenMap[toToken] || toToken) : undefined;

    // Open Reown swap view with pre-configured "TO" token
    openAppKit({ 
      view: 'Swap',
      swap: outputToken ? {
        defaultOutputToken: outputToken, // The token user WANTS (pre-selected)
        // defaultInputToken can be left undefined - user selects what they have
      } : undefined
    });
  };

  return (
    <button
      onClick={handleSwap}
      className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all ${className}`}
    >
      <RefreshCw className="w-5 h-5" />
      {toToken ? `Swap to ${toToken}` : 'Swap Tokens'} (via Reown)
    </button>
  );
}

