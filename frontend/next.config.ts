import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Habilita exportação estática para App Router
  assetPrefix: process.env.NODE_ENV === "production" ? "https://dagbok.pro" : "",
};

export default nextConfig;