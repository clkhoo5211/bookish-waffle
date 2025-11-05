/** @type {import('next').NextConfig} */
// Unified configuration for both local dev and GitHub Pages deployment

// Detect build type
const isStaticExport = !!process.env.NEXT_PUBLIC_BASE_PATH;
const isDevelopment = process.env.NODE_ENV === 'development';

// Conditional PWA wrapper
const withPWA = (isDevelopment || isStaticExport)
  ? (config) => config  // No PWA in dev or static export
  : require('next-pwa')({
      dest: 'public',
      register: true,
      skipWaiting: true,
    });

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Conditional configuration based on build type
  ...(isStaticExport && {
    // GitHub Pages static export (ONLY when NEXT_PUBLIC_BASE_PATH is set)
    output: 'export',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  }),
  images: {
    unoptimized: isStaticExport, // Only unoptimize for static export
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Only disable cache for static export builds
    if (isStaticExport) {
      config.cache = false;
    }
    
    // React Native polyfills
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      'react-native': false,
      'react-native-get-random-values': false,
    };
    
    // Node polyfills for Web3
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    
    return config;
  },
};

// Add CSP headers only for local dev server (not static export)
if (isDevelopment && !isStaticExport) {
  nextConfig.headers = async () => {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://*.privy.io https://auth.privy.io",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: blob: https://fonts.gstatic.com https:",
              "connect-src 'self' https://*.privy.io https://*.reown.com https://*.walletconnect.com https://*.walletconnect.org https://api.web3modal.org https://api.web3modal.com wss://*.walletconnect.com wss://*.walletconnect.org https://*.infura.io https://*.alchemyapi.io https://*.etherscan.io https://*.cloudflare.com https://challenges.cloudflare.com https://*.metamask.io https://*.coinbase.com https://www.youtube.com https://youtubei.googleapis.com https://play.google.com https://*.google.com https://*.merkle.io https://eth.merkle.io wss://*.merkle.io https://*.thirdweb.com https://56.rpc.thirdweb.com https://97.rpc.thirdweb.com https://bsc-dataseed.binance.org https://bsc-dataseed1.binance.org https://bsc-dataseed2.binance.org https://bsc-dataseed3.binance.org https://bsc-dataseed4.binance.org https://data-seed-prebsc-1-s1.binance.org:8545 https://data-seed-prebsc-2-s1.binance.org:8545 https://bsc-testnet.publicnode.com https://*.nodereal.io https://*.ankr.com https://testnet-operator-evm.orderly.org",
              "frame-src 'self' https://*.privy.io https://auth.privy.io https://challenges.cloudflare.com https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self' https://*.privy.io https://auth.privy.io",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ],
      },
    ];
  };
}

module.exports = withPWA(nextConfig);
