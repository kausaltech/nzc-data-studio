import { secrets } from 'docker-secret';

import bundleAnalyzer from '@next/bundle-analyzer';

const isProd = process.env.NODE_ENV === 'production';

const sentryAuthToken =
  secrets.SENTRY_AUTH_TOKEN || process.env.SENTRY_AUTH_TOKEN;

const standaloneBuild = process.env.NEXTJS_STANDALONE_BUILD === '1';
const prodAssetPrefix = process.env.NEXTJS_ASSET_PREFIX;

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isProd ? prodAssetPrefix : undefined,
  output: standaloneBuild ? 'standalone' : undefined,
  generateBuildId: async () => {
    if (process.env.NEXTJS_BUILD_ID) return process.env.NEXTJS_BUILD_ID;
    // If a fixed Build ID was not provided, fall back to the default implementation.
    return null;
  },
  experimental: {
    instrumentationHook: true,
  }
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
