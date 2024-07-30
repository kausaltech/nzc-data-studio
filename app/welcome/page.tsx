'use client';

import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Box,
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
    <Container
      maxWidth={false}
      sx={{
        width: '100%',
        height: '100%',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        backgroundColor: 'grey.200',
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          height: '100%',
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
          <Typography variant="h1" paragraph>
            Welcome to NetZeroPlanner
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            In partnership with NetZeroCities and Kausal
          </Typography>
          {status === 'loading' && <Skeleton width={80} height={40} />}
          <Typography variant="body1" color="text.secondary" paragraph>
            Welcome to NetZeroPlanner, your partner in creating sustainable and
            resilient communities. Our platform empowers cities worldwide to
            take decisive action towards achieving net-zero emissions and
            building a greener future for generations to come.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Ready to lead your city towards a sustainable future? Sign up now
            and join the global movement towards net-zero emissions. Let's work
            together to make a lasting impact on our planet!
          </Typography>
          {status === 'loading' && <Typography>Loading...</Typography>}
          {status === 'authenticated' && (
            <>
              <MuiLink
                component={Link}
                href="/"
                sx={{ textDecoration: 'none' }}
              >
                <Button variant="contained" color="primary">
                  Go to Dashboard
                </Button>
              </MuiLink>
            </>
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
        <Box sx={{ flex: 1, height: '100%' }}>
          <CardMedia
            component="img"
            image="/images/nzc-welcome.png"
            alt="NetZeroCities welcome image"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      </Card>
    </Container>
  );
}
