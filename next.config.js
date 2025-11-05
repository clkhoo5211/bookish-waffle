/** @type {import('next').NextConfig} */

// Conditional PWA: enabled for local dev, disabled for static export
const isStaticExport = process.env.NEXT_PUBLIC_BASE_PATH;
const withPWA = isStaticExport 
  ? (config) => config 
  : require('next-pwa')({
      dest: 'public',
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === 'development',
    });

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // GitHub Pages static export configuration
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true, // Required for static export
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = withPWA(nextConfig);
