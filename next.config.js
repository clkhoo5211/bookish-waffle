/** @type {import('next').NextConfig} */
// OPTIMIZED CONFIG FOR FAST DEVELOPMENT

const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: false, // Disable strict mode to avoid double-rendering issues
  swcMinify: true,
  
  // Transpile Reown AppKit packages
  transpilePackages: ['@reown/appkit', '@reown/appkit-adapter-wagmi'],
  
  // Optimize for faster dev server
  ...(isDevelopment && {
    // Disable type checking during dev (run separately)
    typescript: {
      ignoreBuildErrors: true, // Speed up dev, check types separately
    },
    // Disable ESLint during dev (run separately)
    eslint: {
      ignoreDuringBuilds: true, // Speed up dev, lint separately
    },
  }),
  
  images: {
    unoptimized: true, // Faster image loading in dev
  },
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Fix Reown AppKit icon loading issues
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Keep phosphor-icons in main bundle to avoid chunk loading errors
            phosphor: {
              test: /[\\/]node_modules[\\/]phosphor-icons/,
              name: 'phosphor-icons',
              chunks: 'all',
              priority: 20,
            },
            // Keep Reown AppKit in main bundle
            reown: {
              test: /[\\/]node_modules[\\/]@reown/,
              name: 'reown-appkit',
              chunks: 'all',
              priority: 20,
            },
          },
        },
      };
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
  
  // Simplified headers for dev
  ...(isDevelopment && {
    headers: async () => {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'X-DNS-Prefetch-Control', value: 'on' },
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          ],
        },
      ];
    },
  }),
};

module.exports = nextConfig;

