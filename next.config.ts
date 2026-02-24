import type { NextConfig } from "next";

const isGithubPages = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "github-pages";

const nextConfig: NextConfig = {
  output: 'export',
  ...(isGithubPages ? { basePath: '/urban-barnacle' } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
