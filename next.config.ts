import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    qualities: [70, 75, 80, 90, 100],
  },
};

export default nextConfig;
