'use client';

import React from 'react';
import Link from 'next/link';
import { ConnectWallet } from '@/components/wallet/ConnectWallet';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-[#00a19c] hover:text-[#00817d] transition-colors">
              RVMplus
            </Link>
            <nav className="hidden lg:flex gap-4 xl:gap-6">
              <Link href="/" className="text-[#1e293c] font-medium hover:text-[#00a19c] transition-colors">
                Home
              </Link>
              <Link href="/marketplace" className="text-[#1e293c] font-medium hover:text-[#00a19c] transition-colors">
                Marketplace
              </Link>
              <Link href="/swap" className="text-[#1e293c] font-medium hover:text-[#00a19c] transition-colors">
                Swap
              </Link>
              <Link href="/tokens" className="text-[#1e293c] font-medium hover:text-[#00a19c] transition-colors">
                My Tokens
              </Link>
            </nav>
          </div>
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
};

