import * as Sentry from '@sentry/nextjs';

import { apiUrl, deploymentType, sentryDsn } from '@/constants/environment';

Sentry.init({
  dsn: sentryDsn,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: false,
      blockAllMedia: false,
    }),
    Sentry.browserTracingIntegration(),
  ],
  debug: false,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  replaysSessionSampleRate: 0.0,
  replaysOnErrorSampleRate: 1.0,
  tracePropagationTargets: ['localhost', apiUrl],
  environment: deploymentType,
});
