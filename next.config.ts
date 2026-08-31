import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "bluenotary.us",
      },
    ],
  },
  // Ensure the content directory is bundled with serverless functions on Vercel
  outputFileTracingIncludes: {
    "/**": ["content/**/*"],
  },
};

export default nextConfig;
