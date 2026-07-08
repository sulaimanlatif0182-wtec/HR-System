import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack to fix PostCSS issues on Vercel
  experimental: {
    turbo: false,
  },
};

export default nextConfig;