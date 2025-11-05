import type { Metadata, Viewport } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import { Web3Providers } from '@/lib/web3/providers';
import { Header } from '@/components/layout/Header';
import { NetworkChecker } from '@/components/wallet/NetworkChecker';
import { CookieConsentBanner } from '@/components/compliance/CookieConsentBanner';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RVM Web3 Payment PWA',
  description: 'Progressive Web App for cryptocurrency payments via Web3',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#00a19c',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="flex flex-col min-h-screen bg-[#f1f5f9] font-sans antialiased">
        <Web3Providers>
          <NetworkChecker />
          <Header />
          <main className="flex-grow">{children}</main>
          {/* Footer moved to home page only */}
          {/* Disabled for faster dev loading */}
          {/* <CookieConsentBanner /> */}
        </Web3Providers>
      </body>
    </html>
  );
}

