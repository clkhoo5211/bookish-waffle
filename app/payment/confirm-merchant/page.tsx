'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Camera, RefreshCw, ExternalLink, ChevronLeft } from 'lucide-react';

export default function PaymentSummaryPage() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleConfirm = async () => {
    setConfirming(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
    setTxHash(mockTxHash);
    setConfirming(false);
    
    setTimeout(() => {
      alert('Payment successful! TX: ' + mockTxHash.slice(0, 10) + '...');
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-6">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Payment Summary</h1>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-amber-50 border-4 border-amber-200 flex items-center justify-center">
            <Camera className="w-12 h-12 text-amber-700" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">The Roaster Bean</h2>
        <p className="text-xl text-center text-gray-600 mb-8">Coffee Co.</p>
        <div className="border-t border-gray-200 mb-6"></div>
        <p className="text-gray-500 text-center mb-4">Token Available</p>
        <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl mb-8 border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Camera className="w-6 h-6 text-amber-700" />
            </div>
            <span className="font-semibold text-gray-800">TRBCC Token</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">150</span>
        </div>
        <p className="text-gray-500 text-center mb-4">Pay With</p>
        <div className="flex gap-3 mb-8">
          <button className="flex-1 py-3 bg-gray-100 rounded-full font-semibold text-gray-600">BNB</button>
          <button className="flex-1 py-3 bg-teal-500 text-white rounded-full font-semibold">USDT</button>
          <button className="flex-1 py-3 bg-gray-100 rounded-full font-semibold text-gray-600">USD1</button>
        </div>
        <div className="border-t border-gray-200 mb-6"></div>
        <p className="text-gray-500 text-center mb-6">Summary</p>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Spending</span>
            <span className="font-semibold text-gray-800">50.00 USDT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Local Currency</span>
            <span className="font-semibold text-gray-800">≈ RM240.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Token Discount</span>
            <span className="font-semibold text-green-600">-100 tokens</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-2xl mb-6 border-2 border-teal-200">
          <p className="text-center text-gray-700 mb-2 font-semibold">Actual Payment</p>
          <p className="text-5xl font-bold text-teal-600 text-center mb-2">40.00 USDT</p>
          <p className="text-center text-gray-700 font-semibold">≈ RM192.00</p>
        </div>
        {txHash && (
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <p className="text-sm text-gray-700 mb-2 font-semibold">Transaction Hash:</p>
            <p className="text-xs font-mono text-gray-600 break-all">{txHash}</p>
            <button className="mt-2 text-blue-600 text-sm flex items-center gap-1 hover:underline">
              <ExternalLink className="w-4 h-4" />
              View on BSCScan
            </button>
          </div>
        )}
        <div className="space-y-3">
          <Link href="/">
            <button 
              disabled={confirming}
              className="w-full py-4 border-2 border-gray-300 rounded-full font-semibold text-gray-700"
            >
              Cancel
            </button>
          </Link>
          <button 
            onClick={handleConfirm}
            disabled={confirming}
            className="w-full py-4 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-600 flex items-center justify-center gap-2"
          >
            {confirming ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Confirming...
              </>
            ) : (
              'Confirm & Pay'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
