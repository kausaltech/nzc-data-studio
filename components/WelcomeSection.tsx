import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Skeleton,
  Link as MuiLink,
} from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { introContent } from '@/constants/intro-content';

const WelcomeSection: React.FC = () => {
  const { status } = useSession();

  const handleSignIn = () => {
    signIn('paths-oidc-provider', { callbackUrl: '/' });
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' },
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
          <MuiLink component={Link} href="/" sx={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Go to Dashboard
            </Button>
          </MuiLink>
        )}
        {status === 'unauthenticated' && (
          <Button
            sx={{ marginTop: 2, maxWidth: 150 }}
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
  );
};

export default WelcomeSection;
