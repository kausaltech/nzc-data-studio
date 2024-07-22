'use client';

import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import { signIn, useSession } from 'next-auth/react';

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
          {status !== 'authenticated' && (
            <Button variant="contained" onClick={handleSignIn}>
              Sign in
            </Button>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
