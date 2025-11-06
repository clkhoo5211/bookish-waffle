'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useAppKit } from '@reown/appkit/react';
import { useChainId } from 'wagmi';

interface ReownSwapButtonProps {
  toToken?: string; // Token symbol to swap TO (e.g., 'BNB', 'USDT')
  toTokenAddress?: string; // Optional: specific token address
  className?: string;
}

/**
 * Reown Swap Button Component
 * Opens Reown AppKit swap modal for exchanging tokens
 * Pre-configures the "TO" token so users can swap FROM any token they have
 */
export function ReownSwapButton({ toToken, toTokenAddress, className = '' }: ReownSwapButtonProps) {
  const { open: openAppKit } = useAppKit();
  const chainId = useChainId();

  const handleSwap = () => {
    // Try multiple parameter variations to find what works
    const swapConfig: any = { view: 'Swap' };
    
    if (toToken || toTokenAddress) {
      // Try all possible parameter names based on different Reown versions
      swapConfig.params = {
        toToken: toToken,
        toTokenAddress: toTokenAddress,
        defaultToToken: toToken,
        defaultOutputToken: toToken,
        defaultCryptoCurrency: toToken,
        outputToken: toToken,
      };
      
      // Also try at top level (some versions use this)
      swapConfig.toToken = toToken;
      swapConfig.toTokenAddress = toTokenAddress;
    }

    console.log('Opening swap with config:', swapConfig);
    openAppKit(swapConfig);
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

