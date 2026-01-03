import 'dotenv/config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    allowedDevOrigins: ["https://*.cloudworkstations.dev"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.buymeacoffee.com',
      },
      // 1. Added: Required for Gemini AI generated images
      {
        protocol: 'https',
        hostname: 'generativelanguage.googleapis.com',
      },
      // 2. Added: Useful if you use random placeholder images
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
  },
  
  // 3. Added: CORS Configuration to allow Mobile App Access
  async headers() {
    return [
      {
        // Match the mobile-chat API route
        source: "/api/mobile-chat",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Allows connection from your mobile app
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
};

export default nextConfig;
