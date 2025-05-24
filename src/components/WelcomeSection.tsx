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
  Grid,
  Stack,
} from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { introContent } from '@/constants/intro-content';
import { BoxArrowUpRight } from 'react-bootstrap-icons';

const WelcomeSection: React.FC = () => {
  const { status } = useSession();

  const handleSignIn = () => {
    void signIn('paths-oidc-provider', { callbackUrl: '/' });
  };

  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Grid container>
        <Grid size={{ xs: 12, sm: 8, md: 6 }}>
          <CardContent
            sx={{
              flex: 1,
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="h2" gutterBottom>
              {introContent.title}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" paragraph>
              {introContent.subtitle}
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              NetZeroPlanner is a powerful online tool that enables cities to
              assess the impact of their Climate Action Plans, refine them, and
              ensure they meet decarbonisation goals.
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              This tool is available to city users of the NetZeroCities Portal,{' '}
              <MuiLink
                href="https://netzerocities.eu/"
                target="_blank"
                rel="noreferrer noopener"
              >
                visit the Portal
              </MuiLink>{' '}
              to find out more and create an account.
            </Typography>

            <Box sx={{ mt: 2 }}>
              {status === 'loading' && <Skeleton width={160} height={60} />}

              {status === 'authenticated' && (
                <div>
                  <Button
                    component={Link}
                    href="/"
                    variant="contained"
                    color="primary"
                  >
                    Go to the Dashboard
                  </Button>
                </div>
              )}

              {status === 'unauthenticated' && (
                <Stack
                  spacing={1}
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems="flex-start"
                >
                  <Button
                    variant="contained"
                    href="https://netzerocities.app/signup"
                    rel="noreferrer noopener"
                    target="_blank"
                    endIcon={<BoxArrowUpRight size={14} />}
                  >
                    Create a NetZeroCities account
                  </Button>
                  <Button variant="text" onClick={handleSignIn}>
                    Or sign in
                  </Button>
                </Stack>
              )}
            </Box>
          </CardContent>
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 6 }} position="relative">
          <CardMedia
            component="img"
            image="/images/illustrations/undraw_city_life_gnpr.svg"
            alt="NetZeroCities welcome image"
            sx={{
              position: { sm: 'absolute' },
              bottom: { sm: -20 },
              left: { sm: 0 },
              minWidth: { sm: 600 },
              maxWidth: 'none',
              width: { xs: '140%', sm: 0 },
              my: { xs: '-20%', sm: 0 },
              ml: { xs: '-10%', sm: 0 },
              mr: { xs: '-10%', sm: 0 },
            }}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default WelcomeSection;
