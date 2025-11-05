/** @type {import('next').NextConfig} */
// Local development configuration with full PWA and CSP

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['wagmi', 'viem', '@privy-io/react-auth'],
  },
  // Webpack config to handle React Native dependencies
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      'react-native': false,
      'react-native-get-random-values': false,
    };
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    
    return config;
  },
  // Security headers for local development
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://*.privy.io https://auth.privy.io",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.privy.io https://*.reown.com https://*.walletconnect.com https://*.walletconnect.org https://api.web3modal.org https://api.web3modal.com wss://*.walletconnect.com wss://*.walletconnect.org https://*.infura.io https://*.alchemyapi.io https://*.etherscan.io https://*.cloudflare.com https://challenges.cloudflare.com https://*.metamask.io https://www.youtube.com https://youtubei.googleapis.com https://play.google.com https://*.google.com https://*.merkle.io https://eth.merkle.io wss://*.merkle.io https://*.thirdweb.com https://56.rpc.thirdweb.com https://97.rpc.thirdweb.com https://bsc-dataseed.binance.org https://bsc-dataseed1.binance.org https://bsc-dataseed2.binance.org https://bsc-dataseed3.binance.org https://bsc-dataseed4.binance.org https://data-seed-prebsc-1-s1.binance.org:8545 https://data-seed-prebsc-2-s1.binance.org:8545 https://bsc-testnet.publicnode.com https://*.nodereal.io https://*.ankr.com https://testnet-operator-evm.orderly.org",
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
  },
};

module.exports = withPWA(nextConfig);

