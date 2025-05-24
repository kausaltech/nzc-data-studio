import * as Sentry from '@sentry/nextjs';

import { initSentryBrowser } from '@common/sentry/client-init';
import { initBrowserRootLogger } from '@common/logging/browser';

function initSentry() {
  initSentryBrowser();
}

initBrowserRootLogger();
initSentry();

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
