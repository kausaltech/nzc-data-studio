import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import { secrets } from 'docker-secret';

const isProd = process.env.NODE_ENV === 'production';

const sentryAuthToken =
  secrets.SENTRY_AUTH_TOKEN || process.env.SENTRY_AUTH_TOKEN;

const standaloneBuild = process.env.NEXTJS_STANDALONE_BUILD === '1';
const prodAssetPrefix = process.env.NEXTJS_ASSET_PREFIX;

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isProd ? prodAssetPrefix : undefined,
  output: standaloneBuild ? 'standalone' : undefined,
  productionBrowserSourceMaps: true,
  generateBuildId: async () => {
    if (process.env.NEXTJS_BUILD_ID) return process.env.NEXTJS_BUILD_ID;
    // If a fixed Build ID was not provided, fall back to the default implementation.
    return null;
  },
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
  },
};

const sentryDebug = !isProd || process.env.SENTRY_DEBUG === '1';

function initSentryWebpack(config) {
  /**
   * @type {import('@sentry/nextjs').SentryBuildOptions}
   */
  const sentryOptions = {
    silent: false,
    telemetry: false,
    authToken: sentryAuthToken,
    release: {
      setCommits: {
        auto: true,
      },
    },
    disableLogger: !sentryDebug,
    widenClientFileUpload: true,
    automaticVercelMonitors: false,
    reactComponentAnnotation: {
      enabled: true,
    },
  };

  // Make sure adding Sentry options is the last code to run before exporting, to
  // ensure that your source maps include changes from all other Webpack plugins
  return withSentryConfig(config, sentryOptions);
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default initSentryWebpack(withBundleAnalyzer(nextConfig));
