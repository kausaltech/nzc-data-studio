'use client';

import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Link as MuiLink,
  Skeleton,
} from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Welcome() {
  const { status } = useSession();

  function handleSignIn() {
    signIn('paths-oidc-provider', { callbackUrl: '/' });
  }

  return (
    <Container>
      <Card>
        <CardContent>
          <Typography variant="h1" paragraph>
            Welcome to NetZeroPlanner
          </Typography>
          {status === 'loading' && <Skeleton width={80} height={40} />}
          {status === 'authenticated' && (
            <MuiLink component={Link} href="/">
              Home
            </MuiLink>
          )}
          {status === 'unauthenticated' && (
            <Button variant="contained" onClick={handleSignIn}>
              Sign in
            </Button>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
