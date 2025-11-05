import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Camera, RefreshCw } from 'lucide-react';

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto flex justify-around py-3">
        <Link 
          href="/"
          className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-teal-600' : 'text-gray-400'}`}
        >
          <div className="w-6 h-6 bg-current rounded"></div>
          <span className="text-xs font-semibold">Home</span>
        </Link>
        <Link 
          href="/marketplace"
          className={`flex flex-col items-center gap-1 ${pathname === '/marketplace' ? 'text-teal-600' : 'text-gray-400'}`}
        >
          <Search className="w-6 h-6" />
          <span className="text-xs font-semibold">Explore</span>
        </Link>
        <Link 
          href="/tokens"
          className={`flex flex-col items-center gap-1 ${pathname === '/tokens' ? 'text-teal-600' : 'text-gray-400'}`}
        >
          <Camera className="w-6 h-6" />
          <span className="text-xs font-semibold">Tokens</span>
        </Link>
        <Link 
          href="/swap"
          className={`flex flex-col items-center gap-1 ${pathname === '/swap' ? 'text-teal-600' : 'text-gray-400'}`}
        >
          <RefreshCw className="w-6 h-6" />
          <span className="text-xs font-semibold">Swap</span>
        </Link>
      </div>
    </div>
  );
};

