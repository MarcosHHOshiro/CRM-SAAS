import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  transpilePackages: ['@crm-saas/types'],
};

export default nextConfig;
