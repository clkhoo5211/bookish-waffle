'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin } from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';

// Varied merchant mock data
const allMerchants = [
  {
    id: 1,
    name: 'Nas Fish n Chips',
    location: '28-G, Jalan Puteri 1/4, Bandar Puteri, 47100 Puchong',
    bnbRebate: '20%',
    tokenRebate: '10%',
    distance: '0.5 km',
    gradient: 'from-pink-400 to-orange-400',
    category: 'Restaurant'
  },
  {
    id: 2,
    name: 'The Roasted Bean Coffee Co.',
    location: '15-A, Jalan Setia 2/3, Taman Setia, 47100 Puchong',
    bnbRebate: '15%',
    tokenRebate: '15%',
    distance: '0.8 km',
    gradient: 'from-amber-400 to-yellow-400',
    category: 'Cafe'
  },
  {
    id: 3,
    name: 'Fresh Mart Grocery',
    location: '42-B, Jalan Kenari 5/2, Bandar Puchong Jaya, 47100 Puchong',
    bnbRebate: '10%',
    tokenRebate: '20%',
    distance: '1.2 km',
    gradient: 'from-green-400 to-teal-400',
    category: 'Grocery'
  },
  {
    id: 4,
    name: 'PowerGym Fitness Center',
    location: '8-G, IOI Boulevard, Bandar Puchong Jaya, 47170 Puchong',
    bnbRebate: '25%',
    tokenRebate: '5%',
    distance: '1.5 km',
    gradient: 'from-blue-400 to-purple-400',
    category: 'Fitness'
  },
  {
    id: 5,
    name: 'Style Avenue Boutique',
    location: '22-1, Jalan Puteri 7/1, Bandar Puteri, 47100 Puchong',
    bnbRebate: '12%',
    tokenRebate: '18%',
    distance: '1.8 km',
    gradient: 'from-purple-400 to-pink-400',
    category: 'Fashion'
  },
  {
    id: 6,
    name: 'BookWorld Bookstore',
    location: '5-3, Jalan Wawasan 2/1, Bandar Puchong Jaya, 47170 Puchong',
    bnbRebate: '8%',
    tokenRebate: '22%',
    distance: '2.1 km',
    gradient: 'from-indigo-400 to-blue-400',
    category: 'Books'
  },
  {
    id: 7,
    name: 'Cafe Mocha',
    location: '12-G, Jalan Setia 4/5, Taman Setia, 47100 Puchong',
    bnbRebate: '18%',
    tokenRebate: '12%',
    distance: '2.5 km',
    gradient: 'from-orange-400 to-red-400',
    category: 'Cafe'
  },
  {
    id: 8,
    name: 'Urban Eats Restaurant',
    location: '33-2, Jalan Kenari 3/4, Bandar Puchong Jaya, 47100 Puchong',
    bnbRebate: '22%',
    tokenRebate: '8%',
    distance: '3.0 km',
    gradient: 'from-red-400 to-pink-400',
    category: 'Restaurant'
  },
];

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter merchants based on search term
  const filteredMerchants = allMerchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-[#fafafa] pb-20">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <div className="p-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900">MARKET PLACE</h1>
          </div>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search merchants"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>
          <div className="px-4 mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Puchong, Selangor
              {searchTerm && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredMerchants.length} results)
                </span>
              )}
            </h2>
          </div>
          <div className="px-4 pb-20">
            {filteredMerchants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">No merchants found</p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-teal-600 text-sm hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              filteredMerchants.map((merchant) => (
                <div key={merchant.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow mb-5">
                  <div className={`h-48 bg-gradient-to-r ${merchant.gradient} relative flex items-center justify-center`}>
                    <div className="text-white text-center">
                      <p className="text-3xl font-bold drop-shadow-lg">{merchant.category}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 text-[15px] leading-tight">{merchant.name}</h3>
                    <div className="flex items-start gap-1 mb-3">
                      <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-gray-600 leading-relaxed">{merchant.location}</p>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold">
                        ⭐ {merchant.bnbRebate} BNB
                      </span>
                      <span className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full font-semibold">
                        🎫 {merchant.tokenRebate} Token
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">📍 {merchant.distance} away</span>
                      <Link href="/payment/confirm-merchant">
                        <button className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-teal-600 transition-colors">
                          Pay Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
