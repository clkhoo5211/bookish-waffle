'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { ChevronLeft, Copy } from 'lucide-react';
import QRCode from 'react-qr-code';

// Get basePath for assets (GitHub Pages needs this)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function ReceivePointsPage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const displayAddress = address || '0x0000000000000000000000000000000000000000';

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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b">
          <Link href="/">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Receive Point</h1>
        </div>

        {/* Tab Navigation */}
        <div className="p-4">
          <div className="flex gap-2">
            <Link href="/points/transfer" className="flex-1">
              <button className="w-full py-3 px-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">
                Transfer Point
              </button>
            </Link>
            <button className="flex-1 py-3 px-4 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl font-semibold">
              Receive Point
            </button>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="p-4">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="bg-white p-4 rounded-2xl border-4 border-black">
                  <QRCode 
                    value={displayAddress}
                    size={220}
                    level="H"
                    className="w-full h-full"
                  />
                  {/* BNB Logo in Center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center p-2">
                      <Image 
                        src={`${basePath}/logos/bnb.png`} 
                        alt="BNB" 
                        width={32} 
                        height={32}
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-mono text-gray-800 break-all flex-1">
                  {mounted ? (address || '0x1234....5678') : 'Loading...'}
                </p>
                <button
                  onClick={handleCopy}
                  disabled={!address || !mounted}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 disabled:opacity-50"
                >
                  {copied ? (
                    <span className="text-green-600 text-sm">✓</span>
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Supported Network */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 mb-3 text-center">Supported Network</p>
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center">
                  <Image src={`${basePath}/logos/bnb.png`} alt="BNB" width={28} height={28} className="z-0" />
                  <Image src={`${basePath}/logos/usdt.png`} alt="USDT" width={28} height={28} className="-ml-2 z-10" />
                </div>
                <span className="font-semibold text-gray-900">BNB Chain</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <p className="text-xs text-gray-400">
            Securely powered by Iota Web3Pay
          </p>
        </div>

        {/* Instructions */}
        <div className="p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to Receive Points:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal pl-5">
              <li>Share this QR code with the sender</li>
              <li>Or copy your wallet address and share it</li>
              <li>Wait for the transaction to complete</li>
              <li>Points will appear in your balance</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

