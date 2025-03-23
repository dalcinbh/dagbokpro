import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Removido output: "export" para permitir rotas API
  assetPrefix: process.env.NODE_ENV === "production" ? "https://dagbok.pro" : "",
  images: {
    domains: ['images.unsplash.com', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
  // Configuração para o proxy da API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;