'use client';

import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Box,
  Typography,
  Link as MuiLink,
  Skeleton,
} from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import IntroSection from '../../components/IntroSection';
import {
  introContent,
  benefitsTitle,
  benefits,
  servicesTitle,
  services,
} from '../../constants/IntroContent';

export default function Welcome() {
  const { status } = useSession();

  function handleSignIn() {
    signIn('paths-oidc-provider', { callbackUrl: '/' });
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <Stack
        spacing={4}
        sx={{ width: '100%', maxWidth: 'lg', margin: 'auto', padding: 0 }}
      >
        <Card
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <CardContent
            sx={{
              flex: 1,
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h2" paragraph>
              {introContent.title}
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              {introContent.subtitle}
            </Typography>
            {status === 'loading' && <Skeleton width={80} height={40} />}
            <Typography variant="body1" color="text.secondary" paragraph>
              {introContent.introduction}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {introContent.callToAction}
            </Typography>
            {status === 'loading' && <Typography>Loading...</Typography>}
            {status === 'authenticated' && (
              <MuiLink
                component={Link}
                href="/"
                sx={{ textDecoration: 'none' }}
              >
                <Button variant="contained" color="primary">
                  Go to Dashboard
                </Button>
              </MuiLink>
            )}
            {status === 'unauthenticated' && (
              <Button
                sx={{ marginTop: 2 }}
                variant="contained"
                color="primary"
                onClick={handleSignIn}
              >
                Sign in
              </Button>
            )}
          </CardContent>
          <Box sx={{ flex: 1 }}>
            <CardMedia
              component="img"
              image="/images/nzc-welcome.png"
              alt="NetZeroCities welcome image"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        </Card>
        <IntroSection title={benefitsTitle} items={benefits} />
        <IntroSection title={servicesTitle} items={services} />
      </Stack>
    </Container>
  );
}
