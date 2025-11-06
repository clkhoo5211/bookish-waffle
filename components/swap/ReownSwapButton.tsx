'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useAppKit } from '@reown/appkit/react';

interface ReownSwapButtonProps {
  className?: string;
}

/**
 * Reown Swap Button Component
 * Opens Reown AppKit swap modal for exchanging tokens
 */
export function ReownSwapButton({ className = '' }: ReownSwapButtonProps) {
  const { open: openAppKit } = useAppKit();

  const handleSwap = () => {
    // Open Reown swap view
    openAppKit({ view: 'Swap' });
  };

  return (
    <button
      onClick={handleSwap}
      className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all ${className}`}
    >
      <RefreshCw className="w-5 h-5" />
      Swap Tokens (via Reown)
    </button>
  );
}

