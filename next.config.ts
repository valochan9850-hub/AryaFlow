import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly disable turbopack for builds
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
