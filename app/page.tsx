'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRVMStore } from '@/store/rvmStore';
import { useAccount } from 'wagmi';
import { Wallet, X, ChevronDown, User } from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';
import { ConnectWallet } from '@/components/wallet/ConnectWallet';

// Banner interface
interface Banner {
  id: number;
  type: 'html' | 'image' | 'gif' | 'video' | 'text';
  title: string;
  gradient: string;
  thumbnail: string;
  content: string;
  imageUrl?: string;
  gifUrl?: string;
  videoUrl?: string;
}

// Horizontal scroll banner mock data with varied content types
const horizontalBanners: Banner[] = [
  {
    id: 1,
    type: 'html',
    title: 'Redeem RVMPlus Now!',
    gradient: 'from-yellow-400 to-orange-400',
    thumbnail: 'Redeem',
    content: `
      <h2 class="text-2xl font-bold mb-4">Exclusive Redemption Offer!</h2>
      <p class="mb-4">Join the RVMPlus revolution and start earning double rewards today!</p>
      <h3 class="text-xl font-bold mb-2">How it Works:</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Make purchases at any participating RVMPlus merchant</li>
        <li>Instantly earn <strong>5% BNB</strong> cashback on every transaction</li>
        <li>Plus receive <strong>5% RVM tokens</strong> as loyalty rewards</li>
        <li>Stack your rewards and watch your wallet grow!</li>
      </ul>
      <p class="text-sm text-gray-600 mt-4">*Terms and conditions apply.</p>
    `
  },
  {
    id: 2,
    type: 'image',
    title: 'EARN BNB REWARD',
    gradient: 'from-green-400 to-green-500',
    thumbnail: 'BNB Rewards',
    imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80',
    content: `
      <h2 class="text-2xl font-bold mb-4">BNB Rewards Program</h2>
      <p class="mb-4">Maximize your earnings with our exclusive BNB rewards program!</p>
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p class="font-bold">🥉 Bronze: 3% BNB back (0-1000 RVM)</p>
      </div>
      <div class="bg-gray-200 border-l-4 border-gray-500 p-4 mb-4">
        <p class="font-bold">🥈 Silver: 5% BNB back (1001-5000 RVM)</p>
      </div>
      <div class="bg-yellow-100 border-l-4 border-yellow-600 p-4 mb-4">
        <p class="font-bold">🥇 Gold: 7% BNB back (5001+ RVM)</p>
      </div>
    `
  },
  {
    id: 7,
    type: 'gif',
    title: 'Celebration!',
    gradient: 'from-yellow-400 to-orange-400',
    thumbnail: 'Celebrate',
    gifUrl: 'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif',
    content: `
      <h2 class="text-2xl font-bold mb-4">🎉 Celebrating 100K Users!</h2>
      <p class="mb-4">We're thrilled to announce that RVMPlus has reached 100,000 active users!</p>
      <div class="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl mb-4 text-center">
        <p class="text-5xl font-bold text-orange-600 mb-2">100,000+</p>
        <p class="text-lg font-semibold text-gray-800">Active Users Worldwide</p>
      </div>
      <h3 class="text-lg font-bold mb-2">Special Milestone Rewards:</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Double BNB rewards for the next 7 days!</li>
        <li>Exclusive NFT airdrop for top 1000 users</li>
        <li>50% bonus on all RVM token swaps</li>
        <li>Free premium merchant access</li>
      </ul>
      <p class="bg-orange-50 p-4 rounded-lg text-orange-800 font-semibold">
        🎁 Limited time celebration rewards - claim yours now!
      </p>
    `
  },
  {
    id: 3,
    type: 'text',
    title: 'New Merchant Alert!',
    gradient: 'from-blue-400 to-purple-400',
    thumbnail: 'New Merchants',
    content: `
      <h2 class="text-2xl font-bold mb-4">🎉 50+ New Merchants Join RVMPlus!</h2>
      <p class="mb-4">We're excited to announce that over 50 new merchants have joined the RVMPlus ecosystem this month!</p>
      <h3 class="text-lg font-bold mb-2">Featured Merchants:</h3>
      <ul class="space-y-3 mb-4">
        <li>• PowerGym Fitness Center - 25% BNB + 5% RVM</li>
        <li>• Style Avenue Boutique - 12% BNB + 18% RVM</li>
        <li>• BookWorld Bookstore - 8% BNB + 22% RVM</li>
        <li>• Fresh Mart Grocery - 10% BNB + 20% RVM</li>
      </ul>
      <p class="bg-blue-50 p-4 rounded-lg">
        Visit the Marketplace to discover all new merchants near you!
      </p>
    `
  },
  {
    id: 4,
    type: 'video',
    title: 'How to Use RVMPlus',
    gradient: 'from-pink-400 to-red-400',
    thumbnail: 'Tutorial',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: `
      <h2 class="text-2xl font-bold mb-4">📺 Watch Our Tutorial</h2>
      <div class="aspect-video w-full bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
        <iframe 
          width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          class="rounded-lg"
        ></iframe>
      </div>
      <p class="mb-4">Learn how to maximize your RVMPlus experience in just 3 minutes!</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Connect your wallet securely</li>
        <li>Find nearby merchants</li>
        <li>Make payments and earn rewards</li>
        <li>Track your BNB and RVM earnings</li>
      </ul>
    `
  },
  {
    id: 5,
    type: 'html',
    title: 'Referral Program',
    gradient: 'from-teal-400 to-cyan-400',
    thumbnail: 'Refer & Earn',
    content: `
      <h2 class="text-2xl font-bold mb-4">👥 Invite Friends, Earn Together!</h2>
      <p class="mb-4">Share the RVMPlus experience and get rewarded for every friend who joins!</p>
      <div class="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl mb-4 border-2 border-teal-200">
        <p class="text-3xl font-bold text-teal-600 text-center mb-2">100 RVM</p>
        <p class="text-center text-gray-700 font-semibold">For each successful referral!</p>
      </div>
      <h3 class="text-lg font-bold mb-2">Your friends also get:</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>50 RVM welcome bonus</li>
        <li>10% extra rewards on first 5 transactions</li>
        <li>Priority merchant access</li>
      </ul>
      <p class="bg-orange-50 p-4 rounded-lg text-orange-800 font-semibold">
        🎁 Limited time: Double referral rewards until end of month!
      </p>
    `
  },
  {
    id: 6,
    type: 'text',
    title: 'Security Update',
    gradient: 'from-indigo-400 to-blue-400',
    thumbnail: 'Security',
    content: `
      <h2 class="text-2xl font-bold mb-4">🔒 Enhanced Security Features</h2>
      <p class="mb-4">Your safety is our priority. We've implemented new security measures:</p>
      <div class="space-y-4">
        <div class="bg-green-50 border-l-4 border-green-500 p-4">
          <p class="font-bold text-green-800">✓ Multi-Signature Transactions</p>
          <p class="text-sm text-green-700">Extra layer of protection for large transfers</p>
        </div>
        <div class="bg-green-50 border-l-4 border-green-500 p-4">
          <p class="font-bold text-green-800">✓ Biometric Authentication</p>
          <p class="text-sm text-green-700">Face ID and fingerprint support</p>
        </div>
        <div class="bg-green-50 border-l-4 border-green-500 p-4">
          <p class="font-bold text-green-800">✓ Real-time Fraud Detection</p>
          <p class="text-sm text-green-700">AI-powered transaction monitoring</p>
        </div>
      </div>
      <p class="mt-4 text-sm text-gray-600">
        All transactions are encrypted and verified on BNB Chain for maximum security.
      </p>
    `
  }
];

export default function Home() {
  const { rvmBalance, bnbReward } = useRVMStore();
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [currentBannerRow1, setCurrentBannerRow1] = useState(0);
  const [currentBannerRow2, setCurrentBannerRow2] = useState(0);

  // Prevent hydration mismatch by only rendering wallet info after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll Row 1 banners every 5 seconds
  useEffect(() => {
    const row1Banners = horizontalBanners.slice(0, 3);
    const timer = setInterval(() => {
      setCurrentBannerRow1((prev) => (prev + 1) % row1Banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll Row 2 banners every 5 seconds (offset by 2.5s)
  useEffect(() => {
    const row2Banners = horizontalBanners.slice(3);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentBannerRow2((prev) => (prev + 1) % row2Banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }, 2500); // Offset by 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  const openBannerModal = (bannerId: number) => {
    setSelectedBannerId(bannerId);
  };

  const closeBannerModal = () => {
    setSelectedBannerId(null);
  };

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  const currentBanner = horizontalBanners.find(b => b.id === selectedBannerId);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-400">
        <div className="max-w-md mx-auto">
          <div className="p-6">
            {mounted && isConnected ? (
              <>
                {/* Top Row - My Account & BNB Chain */}
                <div className="flex justify-between items-center gap-3 mb-6">
                  {/* My Account Dropdown */}
                  <div className="relative">
                <button
                  onClick={toggleAccountMenu}
                  className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1.5 hover:bg-white/30 transition-colors"
                >
                  <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">My account</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform ml-0.5 ${showAccountMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showAccountMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-20 min-w-[240px]">
                    <Link href="/link-apps" onClick={() => setShowAccountMenu(false)}>
                      <button className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                        <span className="font-medium text-gray-900 text-sm">Link RVM Apps</span>
                      </button>
                    </Link>
                    <Link href="/points/transfer" onClick={() => setShowAccountMenu(false)}>
                      <button className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2.5 border-t border-gray-100">
                        <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12H3m18 0l-6-6m6 6l-6 6"/>
                        </svg>
                        <span className="font-medium text-gray-900 text-sm">Transfer Points</span>
                      </button>
                    </Link>
                    <Link href="/points/receive" onClick={() => setShowAccountMenu(false)}>
                      <button className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2.5 border-t border-gray-100">
                        <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 12h18M3 12l6-6m-6 6l6 6"/>
                        </svg>
                        <span className="font-medium text-gray-900 text-sm">Receive Points</span>
                      </button>
                    </Link>
                    <Link href="/tokens" onClick={() => setShowAccountMenu(false)}>
                      <button className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2.5 border-t border-gray-100">
                        <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                        <span className="font-medium text-gray-900 text-sm">My Tokens</span>
                      </button>
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <Link href="/about" onClick={() => setShowAccountMenu(false)}>
                      <button className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 16v-4m0-4h.01"/>
                        </svg>
                        <span className="font-medium text-gray-900 text-sm">About RVM Plus</span>
                      </button>
                    </Link>
                    <Link href="/privacy" onClick={() => setShowAccountMenu(false)}>
                      <button className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2.5 border-t border-gray-100">
                        <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        <span className="font-medium text-gray-900 text-sm">Privacy Policy and Cookies</span>
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* BNB Chain Pill */}
              <div className="relative bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 px-4 py-2.5 rounded-full flex items-center gap-2 flex-shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.1)] border border-yellow-200/50">
                <Image src="/logos/bnb.png" alt="BNB" width={20} height={20} className="relative z-10 drop-shadow-sm" />
                <span className="font-semibold text-gray-900 text-sm relative z-10">BNB Chain</span>
              </div>
            </div>

                <p className="text-white/90 text-sm mb-2">Welcome to RVMPlus Dapps!</p>
                <h1 className="text-4xl font-bold text-white mb-1">RVM {rvmBalance.balance.toFixed(2)}</h1>
                <p className="text-white/80 text-sm">+{rvmBalance.changePercent.toFixed(1)}% (RVM{rvmBalance.change24h.toFixed(2)})</p>
              </>
            ) : (
              <>
                {/* Not Connected State */}
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 text-white/60 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
                  <p className="text-white/80 text-sm mb-6">Connect your wallet to access RVMPlus Dapps</p>
                  <ConnectWallet />
                </div>
              </>
            )}
          </div>
          {mounted && isConnected && (
            <div className="px-4 sm:px-6 mb-6">
              <div className="bg-[#1e293b] rounded-3xl p-4 sm:p-5 grid grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto shadow-lg">
              <Link href="/swap" className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-400/15 rounded-xl flex items-center justify-center border border-teal-400/30">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </div>
                <span className="text-white text-[10px] sm:text-xs text-center leading-tight font-medium">Buy RVM</span>
              </Link>
              <Link href="/transactions" className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-400/15 rounded-xl flex items-center justify-center border border-teal-400/30">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                </div>
                <span className="text-white text-[10px] sm:text-xs text-center leading-tight font-medium">Transaction</span>
              </Link>
              <Link href="/marketplace" className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-400/15 rounded-xl flex items-center justify-center border border-teal-400/30">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                  </svg>
                </div>
                <span className="text-white text-[10px] sm:text-xs text-center leading-tight font-medium">Navigation</span>
              </Link>
              <Link href="/link-apps" className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-400/15 rounded-xl flex items-center justify-center border border-teal-400/30">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </div>
                <span className="text-white text-[10px] sm:text-xs text-center leading-tight font-medium">Link RVM Apps</span>
              </Link>
            </div>
          </div>
          )}
          <div className="bg-white rounded-t-3xl px-6 pt-6 pb-24 min-h-[calc(100vh-300px)]">
            {mounted && isConnected && (
              <>
                {/* TOTAL BNB REWARDED Card */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-3xl p-5 mb-6 flex items-center gap-4 border border-yellow-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                <Image src="/logos/bnb.png" alt="BNB" width={32} height={32} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 mb-1 text-sm uppercase tracking-wide">TOTAL BNB REWARDED</p>
                <p className="text-2xl font-bold text-gray-900 mb-0.5">
                  {bnbReward.total.toFixed(5)} <span className="text-base text-gray-600 font-semibold">BNB</span>
                </p>
                <p className="text-xs text-gray-500">Last Update: {new Date(bnbReward.lastUpdate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Row 1 - Auto-Scrolling Carousel */}
            <div className="mb-4 relative">
              <div className="overflow-hidden rounded-3xl">
                <button
                  onClick={() => openBannerModal(horizontalBanners[currentBannerRow1].id)}
                  className="w-full rounded-3xl overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className={`h-40 bg-gradient-to-r ${horizontalBanners[currentBannerRow1].gradient} flex items-center justify-center p-6 relative transition-all duration-500`}>
                    <div className="text-center text-white">
                      <p className="text-2xl sm:text-3xl font-bold drop-shadow-lg mb-2">{horizontalBanners[currentBannerRow1].thumbnail}</p>
                      <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full inline-block">
                        <p className="text-xs font-semibold">
                          {horizontalBanners[currentBannerRow1].type === 'video' ? '📺 Video' : 
                           horizontalBanners[currentBannerRow1].type === 'image' ? '🖼️ Image' : 
                           horizontalBanners[currentBannerRow1].type === 'gif' ? '🎬 GIF' :
                           horizontalBanners[currentBannerRow1].type === 'html' ? '📄 Details' : '📝 Info'}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
              {/* Pagination Dots Row 1 */}
              <div className="flex justify-center gap-2 mt-3">
                {horizontalBanners.slice(0, 3).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerRow1(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentBannerRow1 
                        ? 'w-6 bg-white' 
                        : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Row 2 - Auto-Scrolling Carousel */}
            <div className="mb-6 relative">
              <div className="overflow-hidden rounded-3xl">
                <button
                  onClick={() => openBannerModal(horizontalBanners[3 + currentBannerRow2].id)}
                  className="w-full rounded-3xl overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className={`h-40 bg-gradient-to-r ${horizontalBanners[3 + currentBannerRow2].gradient} flex items-center justify-center p-6 relative transition-all duration-500`}>
                    <div className="text-center text-white">
                      <p className="text-2xl sm:text-3xl font-bold drop-shadow-lg mb-2">{horizontalBanners[3 + currentBannerRow2].thumbnail}</p>
                      <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full inline-block">
                        <p className="text-xs font-semibold">
                          {horizontalBanners[3 + currentBannerRow2].type === 'video' ? '📺 Video' : 
                           horizontalBanners[3 + currentBannerRow2].type === 'image' ? '🖼️ Image' :
                           horizontalBanners[3 + currentBannerRow2].type === 'gif' ? '🎬 GIF' : 
                           horizontalBanners[3 + currentBannerRow2].type === 'html' ? '📄 Details' : '📝 Info'}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
              {/* Pagination Dots Row 2 */}
              <div className="flex justify-center gap-2 mt-3">
                {horizontalBanners.slice(3).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerRow2(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentBannerRow2 
                        ? 'w-6 bg-white' 
                        : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Introducing RVM Web 3.0, the cutting-edge business reward model. Dive into the world of RVM products 
                    and unlock exciting rewards in BNB and RVM points with every purchase.
                  </p>
                </div>
              </>
            )}
            
            {/* Show About section for non-connected users too */}
            {mounted && !isConnected && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Introducing RVM Web 3.0, the cutting-edge business reward model. Dive into the world of RVM products 
                  and unlock exciting rewards in BNB and RVM points with every purchase.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />

      {/* Banner Detail Modal */}
      {selectedBannerId && currentBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeBannerModal}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{currentBanner.title}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {currentBanner.type === 'video' ? '📺 Video Content' : 
                   currentBanner.type === 'image' ? '🖼️ Image Content' : 
                   currentBanner.type === 'html' ? '📄 Rich Content' : '📝 Text Content'}
                </p>
              </div>
              <button
                onClick={closeBannerModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* Banner Hero/Image */}
              <div className={`w-full h-48 bg-gradient-to-r ${currentBanner.gradient} flex items-center justify-center`}>
                <div className="text-center text-white p-6">
                  <p className="text-3xl font-bold drop-shadow-lg">{currentBanner.thumbnail}</p>
                </div>
              </div>

              {/* Banner Content */}
              <div className="p-6">
                {/* Video Content */}
                {currentBanner.type === 'video' && currentBanner.videoUrl ? (
                  <div className="mb-4">
                    <div className="aspect-video w-full bg-gray-900 rounded-lg overflow-hidden">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={currentBanner.videoUrl}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                ) : null}
                
                {/* Image Content */}
                {currentBanner.type === 'image' && currentBanner.imageUrl ? (
                  <div className="mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={currentBanner.imageUrl} 
                      alt={currentBanner.title}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                ) : null}

                {/* GIF Content */}
                {currentBanner.type === 'gif' && currentBanner.gifUrl ? (
                  <div className="mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={currentBanner.gifUrl} 
                      alt={currentBanner.title}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                ) : null}
                
                {/* HTML/Text Content */}
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentBanner.content }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={closeBannerModal}
                className="w-full py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
