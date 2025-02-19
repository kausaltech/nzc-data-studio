'use client';

import { useEffect } from 'react';
import NextError from 'next/error';

import * as Sentry from '@sentry/nextjs';
import { serializeError } from 'serialize-error';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      extra: {
        component: 'global-error',
        error: JSON.stringify(serializeError(error), null, 2),
      },
    });
  }, [error]);

  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
