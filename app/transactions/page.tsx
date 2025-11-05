'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownLeft, ExternalLink, Search, Filter } from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';

// Mock transaction data
const mockTransactions = [
  {
    id: 1,
    hash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    type: 'inflow',
    amount: 0.05,
    currency: 'BNB',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    to: '0x6c1035Ab8907e4d46a47d17c941950eD77ab12Bc',
    timestamp: new Date('2025-11-05T14:30:00'),
    status: 'completed',
    note: 'Payment from The Roasted Bean Coffee Co.'
  },
  {
    id: 2,
    hash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u',
    type: 'outflow',
    amount: 25.50,
    currency: 'USDT',
    from: '0x6c1035Ab8907e4d46a47d17c941950eD77ab12Bc',
    to: '0x9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0',
    timestamp: new Date('2025-11-05T13:15:00'),
    status: 'completed',
    note: 'Payment to Nas Fish n Chips'
  },
  {
    id: 3,
    hash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v',
    type: 'inflow',
    amount: 150.00,
    currency: 'RVM',
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0x6c1035Ab8907e4d46a47d17c941950eD77ab12Bc',
    timestamp: new Date('2025-11-05T11:45:00'),
    status: 'completed',
    note: 'Reward from RVM Loyalty Program'
  },
  {
    id: 4,
    hash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w',
    type: 'outflow',
    amount: 0.025,
    currency: 'BNB',
    from: '0x6c1035Ab8907e4d46a47d17c941950eD77ab12Bc',
    to: '0xabcdef1234567890abcdef1234567890abcdef12',
    timestamp: new Date('2025-11-05T10:20:00'),
    status: 'completed',
    note: 'Swap BNB for RVM'
  },
  {
    id: 5,
    hash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x',
    type: 'inflow',
    amount: 50.00,
    currency: 'USDT',
    from: '0xfedcba0987654321fedcba0987654321fedcba09',
    to: '0x6c1035Ab8907e4d46a47d17c941950eD77ab12Bc',
    timestamp: new Date('2025-11-04T18:30:00'),
    status: 'completed',
    note: 'Deposit from wallet'
  },
  {
    id: 6,
    hash: '0x6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y',
    type: 'outflow',
    amount: 100.00,
    currency: 'RVM',
    from: '0x6c1035Ab8907e4d46a47d17c941950eD77ab12Bc',
    to: '0x1111222233334444555566667777888899990000',
    timestamp: new Date('2025-11-04T15:10:00'),
    status: 'completed',
    note: 'Token redemption at merchant'
  },
  {
    id: 7,
    hash: '0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
    type: 'outflow',
    amount: 15.75,
    currency: 'USDT',
    from: '0x6c1035Ab8907e4d46a47d17c941950eD77ab12Bc',
    to: '0x0000999988887777666655554444333322221111',
    timestamp: new Date('2025-11-04T12:00:00'),
    status: 'pending',
    note: 'Payment processing...'
  },
  {
    id: 8,
    hash: '0x8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a',
    type: 'inflow',
    amount: 0.15,
    currency: 'BNB',
    from: '0xaaaaaabbbbbbccccccddddddeeeeeeffffffffff',
    to: '0x6c1035Ab8907e4d46a47d17c941950eD77ab12Bc',
    timestamp: new Date('2025-11-03T20:45:00'),
    status: 'completed',
    note: 'BNB Reward from merchant'
  },
];

export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | 'inflow' | 'outflow'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.type === filter;
    const matchesSearch = 
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.currency.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <>
      <div className="min-h-screen bg-[#fafafa] pb-20">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900">Transaction History</h1>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 pb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition ${
                  filter === 'all'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('inflow')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition ${
                  filter === 'inflow'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Received
              </button>
              <button
                onClick={() => setFilter('outflow')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition ${
                  filter === 'outflow'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sent
              </button>
            </div>
          </div>

          {/* Transaction List */}
          <div className="px-4 pb-20">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No transactions found</p>
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <Link href={`/transactions/${tx.hash}`} key={tx.id}>
                  <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow mb-5">
                    {/* Icon */}
                    <div className={`w-[60px] h-[60px] rounded-full flex items-center justify-center flex-shrink-0 border-2 border-gray-200 ${
                      tx.type === 'inflow' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {tx.type === 'inflow' ? (
                        <ArrowDownLeft className="w-7 h-7 text-green-600" strokeWidth={2.5} />
                      ) : (
                        <ArrowUpRight className="w-7 h-7 text-red-600" strokeWidth={2.5} />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 text-[15px] leading-tight truncate">
                        {tx.note}
                      </h3>
                      <p className={`text-[15px] mb-1 font-medium ${
                        tx.type === 'inflow' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'inflow' ? '+' : '-'}{tx.amount} {tx.currency}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          tx.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : tx.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                        <span className="text-[11px] text-gray-400">{formatDate(tx.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Summary Section */}
          <div className="fixed bottom-16 left-0 right-0 bg-[#f8f8f8]">
            <div className="max-w-md mx-auto">
              <div className="rounded-3xl bg-white m-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="flex divide-x divide-gray-200">
                  {/* Left Section - Total Received */}
                  <div className="flex-1 p-6">
                    <p className="text-sm text-gray-900 mb-3 font-normal">Total Received</p>
                    <p className="text-4xl font-bold text-green-600">
                      {filteredTransactions.filter(tx => tx.type === 'inflow' && tx.status === 'completed').length}
                    </p>
                  </div>
                  
                  {/* Right Section - Total Sent */}
                  <div className="flex-1 p-6">
                    <p className="text-sm text-gray-900 mb-3 font-normal">Total Sent</p>
                    <p className="text-4xl font-bold text-red-600">
                      {filteredTransactions.filter(tx => tx.type === 'outflow' && tx.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
