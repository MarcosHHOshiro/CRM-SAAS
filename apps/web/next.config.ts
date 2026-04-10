import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@crm-saas/types'],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@crm-saas/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
    };

    return config;
  },
};

export default nextConfig;
