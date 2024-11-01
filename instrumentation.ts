import * as Sentry from '@sentry/nextjs';
import type { Integration } from '@sentry/types';

import { apiUrl, authIssuer, deploymentType, isDev, sentryDsn } from './constants/environment';

async function initSentry() {
  const integrations: Integration[] = [];

  Sentry.init({
    dsn: sentryDsn,
    environment: deploymentType,
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    tracePropagationTargets: ['localhost', apiUrl, authIssuer],
    debug: process.env.SENTRY_DEBUG === '1',
    ignoreErrors: ['NEXT_NOT_FOUND'],
    integrations,
    sendDefaultPii: true,
    spotlight: isDev,
    beforeSend: (event: Sentry.ErrorEvent, hint: Sentry.EventHint) => {
      const error: { statusCode?: number } = hint.originalException as any;
      if (error && error.statusCode && error.statusCode === 404) {
        // eslint-disable-next-line no-console
        console.warn('Ignoring page-not-found error on the server');
        return null;
      }
      return event;
    },
  });
  return Sentry;
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log(`
      Starting nzc-data-studio
        → NODE_ENV: ${process.env.NODE_ENV}
        → API URL: ${apiUrl}
        → Issuer URL: ${authIssuer}
        → Sentry DSN: ${sentryDsn}
    `);
  }
  if (
    process.env.NEXT_RUNTIME === 'edge' ||
    process.env.NEXT_RUNTIME === 'nodejs'
  ) {
    initSentry();
  }
}

export const onRequestError = Sentry.captureRequestError;
