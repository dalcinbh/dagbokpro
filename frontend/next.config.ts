import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removido output: "export" para permitir rotas API
  assetPrefix: process.env.NODE_ENV === "production" ? "https://dagbok.pro" : "",
  images: {
    domains: ['images.unsplash.com'], // Permitir imagens do Unsplash
  },
  // Configuração para o proxy da API
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;