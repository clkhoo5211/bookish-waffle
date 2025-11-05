'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Wallet, RefreshCw } from 'lucide-react';

// Get basePath for assets (GitHub Pages needs this)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function WalletConnectPage() {
  const router = useRouter();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    // Mock wallet connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnecting(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-600 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-white rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
            <Wallet className="w-12 h-12 text-teal-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">RVMPlus DApp</h1>
          <p className="text-teal-100 text-lg">Web3 Crypto Payment & Rewards Platform</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Connect Your Wallet</h2>
          
          <button 
            onClick={handleConnect}
            disabled={connecting}
            className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold text-lg hover:bg-teal-700 transition mb-4 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {connecting ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-6 h-6" />
                Connect Wallet
              </>
            )}
          </button>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-yellow-400 rounded-full"></div>
              <span className="font-semibold text-gray-800">MetaMask</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-400 rounded-full"></div>
              <span className="font-semibold text-gray-800">WalletConnect</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-400 rounded-full"></div>
              <span className="font-semibold text-gray-800">Trust Wallet</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Supported Network</p>
            <div className="flex items-center justify-center gap-2">
              <Image src={`${basePath}/logos/bnb.png`} alt="BNB" width={32} height={32} />
              <span className="font-semibold text-gray-800">BNB Chain (BSC)</span>
            </div>
          </div>
        </div>
        <p className="text-center text-white text-sm">
          By connecting, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}

