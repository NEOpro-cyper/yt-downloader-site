import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.googlevideo.com',
      },
      {
        protocol: 'https',
        hostname: '**.ggpht.com',
      },
    ],
  },
};

export default nextConfig;
