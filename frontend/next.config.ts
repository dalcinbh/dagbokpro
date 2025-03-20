import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Remova ou comente basePath
  // basePath: '/app1',
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
};

export default nextConfig;
