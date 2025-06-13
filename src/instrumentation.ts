import type { VercelEdgeClient } from '@sentry/nextjs';
import { captureRequestError } from '@sentry/nextjs';
import type { NodeClient } from '@sentry/node';

import { printRuntimeConfig } from '@common/env/runtime';
import { getLogger } from '@common/logging/logger';
import { getSpotlightViewUrl, initSentry } from '@common/sentry/server-init';

export const register = async () => {
  if (!process.env.PROJECT_ID) {
    process.env.PROJECT_ID = 'data-studio';
  }
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    printRuntimeConfig('NetZeroCities Data Studio');
    const spotlightUrl = getSpotlightViewUrl();
    const nodeOtel = await import('@common/instrumentation/node');
    nodeOtel.initNodeLogging();
    const logger = getLogger('init');
    const sentryClient = await initSentry();
    if (spotlightUrl && sentryClient) {
      logger.info(
        { release: sentryClient.getOptions().release },
        `🔦 Sentry Spotlight enabled at: ${spotlightUrl}`
      );
    }
    await nodeOtel.initTelemetry(sentryClient as NodeClient);
  } else {
    const edgeOtel = await import('@common/instrumentation/edge');
    edgeOtel.initEdgeLogging();
    const sentryClient = await initSentry();
    await edgeOtel.initTelemetry(sentryClient as VercelEdgeClient);
  }
};

export const onRequestError = captureRequestError;
