/** @type {import('next').NextConfig} */
// MAXIMUM PERFORMANCE OPTIMIZED CONFIG

const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  
  // Transpile only what's needed
  transpilePackages: ['@reown/appkit', '@reown/appkit-adapter-wagmi'],
  
  // Production-like optimizations even in dev
  compiler: {
    removeConsole: isDevelopment ? false : { exclude: ['error', 'warn'] },
  },
  
  // Optimize for faster dev server
  ...(isDevelopment && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
  
  images: {
    unoptimized: true,
    // Add domains if loading external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Advanced webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Vendor chunk for stable libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            // Reown AppKit separate chunk (large library)
            reown: {
              test: /[\\/]node_modules[\\/]@reown/,
              name: 'reown',
              chunks: 'all',
              priority: 20,
            },
            // Phosphor icons bundled
            phosphor: {
              test: /[\\/]node_modules[\\/]phosphor-icons/,
              name: 'phosphor',
              chunks: 'all',
              priority: 20,
            },
            // wagmi/viem
            web3: {
              test: /[\\/]node_modules[\\/](wagmi|viem|@wagmi)/,
              name: 'web3',
              chunks: 'all',
              priority: 15,
            },
          },
        },
      };

      // Reduce module resolution time
      config.resolve.symlinks = false;
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
  
  // Optimized headers
  headers: async () => {
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
        ],
      },
    ];
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: ['lucide-react', '@reown/appkit'], // Tree-shake these packages
  },
};

module.exports = nextConfig;

