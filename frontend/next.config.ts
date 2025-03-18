import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://auth.dagbok.pro' : '', // Match ngrok/production URL
  images: {
    unoptimized: true, // Required for static export
  },
  eslint: {
    ignoreDuringBuilds: true, // Optional: disables ESLint during build if needed
  },
};

export default nextConfig;