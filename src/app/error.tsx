'use client';

import { serializeError } from 'serialize-error';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import {
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { ExclamationCircle } from 'react-bootstrap-icons';
import { useSession } from 'next-auth/react';

type Props = {
  error: Error & { digest?: string };
};

export default function Error({ error }: Props) {
  const session = useSession();

  useEffect(() => {
    Sentry.captureException(error, {
      extra: {
        session: {
          error: session.data?.error,
          user: session.data?.user,
          expires: session.data?.expires,
          status: session.status,
        },
        error: JSON.stringify(serializeError(error), null, 2),
      },
    });
  }, [error, session]);

  return (
    <Container>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <ExclamationCircle size={32} />
            <Typography component="h1" variant="h2">
              Something went wrong
            </Typography>
          </Stack>
          <Typography variant="subtitle1" color="text.secondary">
            We're sorry, but something went wrong on our end. Please try
            refreshing the page or signing out and in again. If that doesn't
            help, please get in touch with us at{' '}
            <Link href="mailto:support@kausal.tech">support@kausal.tech</Link>{' '}
            for assistance.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
