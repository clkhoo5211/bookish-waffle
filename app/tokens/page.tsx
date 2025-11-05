'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RefreshCw, Search, Camera, Coffee, UtensilsCrossed, ShoppingBag, Zap, Shirt, Book } from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';

// Varied mock tokens data
const allTokens = [
  { 
    id: 1, 
    merchant: 'The Roasted Bean Coffee Co.', 
    amount: 150.75, 
    updated: '5m ago',
    icon: Coffee,
    color: 'amber'
  },
  { 
    id: 2, 
    merchant: 'Nas Fish n Chips', 
    amount: 245.50, 
    updated: '15m ago',
    icon: UtensilsCrossed,
    color: 'orange'
  },
  { 
    id: 3, 
    merchant: 'Fresh Mart Grocery', 
    amount: 89.25, 
    updated: '1h ago',
    icon: ShoppingBag,
    color: 'green'
  },
  { 
    id: 4, 
    merchant: 'PowerGym Fitness Center', 
    amount: 320.00, 
    updated: '2h ago',
    icon: Zap,
    color: 'blue'
  },
  { 
    id: 5, 
    merchant: 'Style Avenue Boutique', 
    amount: 175.80, 
    updated: '3h ago',
    icon: Shirt,
    color: 'purple'
  },
  { 
    id: 6, 
    merchant: 'BookWorld Bookstore', 
    amount: 92.40, 
    updated: '5h ago',
    icon: Book,
    color: 'indigo'
  },
  { 
    id: 7, 
    merchant: 'Cafe Mocha', 
    amount: 67.15, 
    updated: '1d ago',
    icon: Coffee,
    color: 'amber'
  },
  { 
    id: 8, 
    merchant: 'Urban Eats Restaurant', 
    amount: 198.60, 
    updated: '2d ago',
    icon: UtensilsCrossed,
    color: 'red'
  },
];

const getColorClasses = (color: string) => {
  const colorMap: { [key: string]: { bg: string; text: string } } = {
    amber: { bg: 'bg-amber-100', text: 'text-amber-700' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700' },
    green: { bg: 'bg-green-100', text: 'text-green-700' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    red: { bg: 'bg-red-100', text: 'text-red-700' },
  };
  return colorMap[color] || colorMap.amber;
};

export default function TokensPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter tokens based on search term
  const filteredTokens = allTokens.filter(token =>
    token.merchant.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalValue = filteredTokens.reduce((sum, token) => sum + token.amount, 0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <>
      <div className="min-h-screen bg-[#fafafa] pb-20">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900">My Tokens</h1>
            <button onClick={handleRefresh} className="hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <RefreshCw className={`w-6 h-6 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search Merchant or token"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>
          <div className="px-4 pb-[88px]">
            {filteredTokens.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No tokens found</p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-teal-600 text-sm mt-2 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              filteredTokens.map((token) => {
                const colors = getColorClasses(token.color);
                const IconComponent = token.icon;
                return (
                  <div key={token.id} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow mb-5">
                    <div className={`w-[60px] h-[60px] rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0 border-2 border-gray-200`}>
                      <IconComponent className={`w-7 h-7 ${colors.text}`} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 text-[15px] leading-tight">{token.merchant}</h3>
                      <p className="text-[15px] text-gray-700 mb-1 font-medium">{token.amount.toFixed(2)} tokens</p>
                      <p className="text-[11px] text-gray-400">Last updated: {token.updated}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {/* Summary Section */}
          <div className="fixed bottom-16 left-0 right-0 pointer-events-none">
            <div className="max-w-md mx-auto">
              <div className="rounded-2xl bg-white mx-4 mb-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden pointer-events-auto">
                <div className="flex divide-x divide-gray-200">
                  {/* Left Section - Total Tokens */}
                  <div className="flex-1 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <p className="text-xs text-gray-600 mb-2 font-medium uppercase tracking-wide">Total Tokens</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {searchTerm ? filteredTokens.length : allTokens.length}
                    </p>
                  </div>
                  
                  {/* Right Section - Total Estimated Value */}
                  <div className="flex-1 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <p className="text-xs text-gray-600 mb-2 font-medium uppercase tracking-wide">Total Value</p>
                    <p className="text-3xl font-bold text-gray-900">RM{totalValue.toFixed(2)}</p>
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
