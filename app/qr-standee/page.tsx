'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Copy, ChevronLeft } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useAccount } from 'wagmi';

export default function QRPaymentPage() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const displayAddress = address || '0x0000000000000000000000000000000000000000';

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-400 via-teal-300 to-teal-200 flex flex-col p-6 relative">
      {/* White Wavy Band */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-white" style={{
        clipPath: 'ellipse(100% 55% at 50% 45%)'
      }}></div>
      
      {/* Back Button */}
      <div className="w-full max-w-md mx-auto mb-4 relative z-10">
        <Link href="/">
          <button className="p-2 bg-white/30 hover:bg-white/50 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
        </Link>
      </div>
      
      {/* Top Section with Icon and Title */}
      <div className="w-full max-w-md mx-auto mb-2 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#1e3a8a] rounded-2xl flex items-center justify-center p-2">
            <Image src="/logos/bnb.png" alt="BNB" width={32} height={32} unoptimized />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Dapps Payment</h1>
        </div>
      </div>

      {/* Welcome Message */}
      <h2 className="text-3xl font-bold text-white text-center mb-8 relative z-10 max-w-md mx-auto">
        Welcome Use Dapps Payment
      </h2>

      {/* QR Code Card */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8 relative z-10 max-w-md mx-auto">
        <div className="w-64 h-64 bg-white border-4 border-black rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* QR Code Pattern */}
          <QRCode 
            value={displayAddress}
            size={224}
            level="H"
            className="w-full h-full"
          />
          {/* BNB Logo in Center of QR */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 bg-[#1e3a8a] rounded-lg flex items-center justify-center p-2">
              <Image 
                src="/logos/bnb.png" 
                alt="BNB" 
                width={40} 
                height={40}
                unoptimized
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Address Card */}
      <div className="bg-white rounded-2xl p-4 mb-6 w-full max-w-md relative z-10">
        <p className="text-sm text-gray-600 mb-2">Your Wallet Address:</p>
        <div className="flex items-center gap-2">
          <p className="text-xs font-mono text-gray-800 flex-1 break-all">
            {mounted ? (address || 'Not Connected - Please connect your wallet') : 'Loading...'}
          </p>
          <button 
            onClick={handleCopy}
            disabled={!address || !mounted}
            className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? <span>✓</span> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Support BNB Chain Section */}
      <div className="w-full max-w-md mx-auto relative z-10">
        <p className="text-xl font-semibold text-white mb-4 text-center">Support BNB Chain</p>
        <div className="flex gap-4 mb-8 justify-center">
          <div className="w-14 h-14 bg-[#1e3a8a] rounded-2xl flex items-center justify-center p-2">
            <Image src="/logos/bnb.png" alt="BNB" width={40} height={40} unoptimized />
          </div>
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2">
            <Image src="/logos/usdt.png" alt="USDT" width={40} height={40} />
          </div>
        </div>
      </div>
    </div>
  );
}
