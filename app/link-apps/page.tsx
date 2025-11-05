'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function LinkAppsPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<'new' | 'link'>('new');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      alert('Verification successful! Redirecting to QR code...');
      // Route to QR standee page after verification
      router.push('/qr-standee');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 max-w-[480px]">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            Link with RVM Apps
          </h1>
        </div>

        {/* Download Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-6">
            You can download RVMPlus Via:
          </h2>
          <div className="bg-[#f8f8f8] rounded-3xl p-8 border border-gray-200 shadow-sm">
            <div className="flex flex-row gap-4 justify-center items-center">
              {/* App Store Button */}
              <a 
                href="https://apps.apple.com/app/rvmplus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black text-white rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-tight">Download on the</div>
                  <div className="font-bold text-base leading-tight">App Store</div>
                </div>
              </a>

              {/* Google Play Button */}
              <a 
                href="https://play.google.com/store/apps/details?id=com.rvmplus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black text-white rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path fill="#34A853" d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35z"/>
                  <path fill="#4285F4" d="M16.81 15.12l-3.12-3.12 3.12-3.12 3.47 1.97c.36.2.59.57.59.98s-.23.78-.59.98l-3.47 1.97z"/>
                  <path fill="#FBBC04" d="M13.69 12L3.84 2.15c.21-.1.44-.15.69-.15.59 0 1.13.29 1.45.77l11.83 6.73-3.12 3.12z"/>
                  <path fill="#EA4335" d="M13.69 12l3.12 3.12L5.98 21.85c-.32.48-.86.77-1.45.77-.25 0-.48-.05-.69-.15L13.69 12z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-tight">GET IT ON</div>
                  <div className="font-bold text-base leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Information Form */}
        <div className="mb-8">
          {/* Title - Outside the box */}
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
            Information Provided:
          </h3>
          
          {/* Main Content Box with Shadow and Gradient */}
          <div className="relative bg-gradient-to-br from-[#fafafa] to-[#f5f5f5] rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] border border-gray-200/50">
            <div className="space-y-6">
              <div>
                <label className="block text-base font-bold text-gray-900 mb-3">
                  Phone Number:
                </label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-4 bg-white rounded-2xl text-center text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 text-base border border-gray-100 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-gray-900 mb-3">
                  Name:
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-4 bg-white rounded-2xl text-center text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 text-base border border-gray-100 shadow-inner"
                />
              </div>
            </div>

            {/* Account Selection */}
            <div className="mt-8">
              <h3 className="text-base font-bold text-gray-900 mb-5">
                Account Selection
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setAccountType('new')}
                  className="flex flex-col items-center gap-3"
                >
                  <div className={`w-full bg-white rounded-2xl p-5 font-semibold text-gray-900 border transition-all ${
                    accountType === 'new' 
                      ? 'border-teal-500 shadow-[0_4px_12px_rgba(20,184,166,0.15)]' 
                      : 'border-gray-200 shadow-[0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
                  }`}>
                    New Account
                  </div>
                  <div className={`w-7 h-7 rounded-full border-[3px] flex items-center justify-center transition-all shadow-sm ${
                    accountType === 'new'
                      ? 'border-teal-500 bg-teal-500'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {accountType === 'new' && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setAccountType('link')}
                  className="flex flex-col items-center gap-3"
                >
                  <div className={`w-full bg-white rounded-2xl p-5 font-semibold text-gray-900 border transition-all ${
                    accountType === 'link' 
                      ? 'border-teal-500 shadow-[0_4px_12px_rgba(20,184,166,0.15)]' 
                      : 'border-gray-200 shadow-[0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
                  }`}>
                    Link Account
                  </div>
                  <div className={`w-7 h-7 rounded-full border-[3px] flex items-center justify-center transition-all shadow-sm ${
                    accountType === 'link'
                      ? 'border-teal-500 bg-teal-500'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {accountType === 'link' && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                </button>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={!phoneNumber || !name || isVerifying}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl font-bold text-lg hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_6px_20px_rgba(20,184,166,0.3),0_2px_8px_rgba(0,0,0,0.1)]"
              >
                {isVerifying ? 'Verifying...' : 'Verify Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Message */}
        <div className="bg-gradient-to-br from-[#fafafa] to-[#f5f5f5] rounded-3xl p-6 border border-gray-200/50 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <p className="text-sm text-center text-gray-900 leading-relaxed">
            Upon completing the verification process, we will assist you in linking Dapps to your current accounts.
          </p>
        </div>
      </div>
    </div>
  );
}

