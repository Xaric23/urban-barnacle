import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/urban-barnacle',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
