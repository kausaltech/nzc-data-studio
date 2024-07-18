import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/theme';
import { AppBar } from '@/components/AppBar';
import { Box, Container } from '@mui/material';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { auth } from '@/config/auth';
import { envMetadata } from '@/utils/environment';
import { ApolloWrapper } from '@/components/providers/ApolloWrapper';
import './globals.css';
import { Logo } from '@/components/Logo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NetZeroPlanner',
  description:
    'NetZeroPaths is an innovative tool designed to help cities achieve climate goals by tracking emissions, forecasting reductions, and evaluating potential actions. Achieve net-zero with our powerful, data-driven platform. Powered by Kausal Open Source in partnership with NetZeroCities.',
  robots: {
    index: false,
    follow: false,
  },
  ...envMetadata,
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const session = await auth();

  return (
    <html lang="en">
      <Box
        component="body"
        className={inter.className}
        sx={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ApolloWrapper>
          <AuthProvider session={session}>
            <AppRouterCacheProvider>
              <ThemeProvider>
                <AppBar />
                <Box component="main" sx={{ my: 4 }}>
                  {children}
                </Box>
                <Box
                  component="footer"
                  sx={{
                    backgroundColor: 'background.dark',
                    color: 'primary.contrastText',
                    py: 4,
                    mt: 'auto',
                  }}
                >
                  <Container>
                    <Logo variant="light" size="lg" />
                  </Container>
                </Box>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </AuthProvider>
        </ApolloWrapper>
      </Box>
    </html>
  );
}
