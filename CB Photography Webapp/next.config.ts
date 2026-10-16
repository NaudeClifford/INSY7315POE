import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  agentRules: false,
  allowedDevOrigins: [
    "localhost:3000",
    "192.168.0.104",
    "192.168.0.104:3000",
    "192.168.0.126",
    "192.168.0.126:3000",
    "192.168.*",
  ],
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

