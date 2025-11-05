'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ChevronLeft, Scan, Copy } from 'lucide-react';

// Get basePath for assets (GitHub Pages needs this)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function TransferPointsPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transferring, setTransferring] = useState(false);
  
  // Mock balance
  const balance = 1350.1234;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMaxAmount = () => {
    setAmount(balance.toString());
  };

  const handleTransfer = async () => {
    if (!recipientAddress || !amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid recipient address and amount');
      return;
    }

    if (parseFloat(amount) > balance) {
      alert('Insufficient balance');
      return;
    }

    setTransferring(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTransferring(false);
    alert('Transfer successful!');
    setRecipientAddress('');
    setAmount('');
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
          <h1 className="text-xl font-bold text-gray-900">RVMplus Point Transfer</h1>
        </div>

        {/* Tab Navigation */}
        <div className="p-4">
          <div className="flex gap-2">
            <button className="flex-1 py-3 px-4 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl font-semibold">
              Transfer Point
            </button>
            <Link href="/points/receive" className="flex-1">
              <button className="w-full py-3 px-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">
                Receive Point
              </button>
            </Link>
          </div>
        </div>

        {/* Transfer Form */}
        <div className="p-4 space-y-4">
          {/* Transfer To */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transfer To
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="0x1234....5678"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="flex-1 py-2 px-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm"
              />
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Scan className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Amount Transfer */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount Transfer
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 py-2 px-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg font-semibold"
              />
              <button
                onClick={handleMaxAmount}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors"
              >
                Max
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Remaining: {balance.toFixed(4)} RVM
            </p>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleTransfer}
            disabled={transferring}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-shadow disabled:opacity-50"
          >
            {transferring ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>

        {/* Footer Info */}
        <div className="p-4 mt-8">
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500 mb-3 text-center">Supported Network</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center">
                <Image src={`${basePath}/logos/bnb.png`} alt="BNB" width={32} height={32} className="z-0" />
                <Image src={`${basePath}/logos/usdt.png`} alt="USDT" width={32} height={32} className="-ml-3 z-10" />
              </div>
              <span className="font-semibold text-gray-900">BNB Chain</span>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Securely powered by Iota Web3Pay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

