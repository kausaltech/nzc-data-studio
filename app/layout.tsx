import { ReactNode } from 'react';
import { headers } from 'next/headers';
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
import { PreferredLocaleProvider } from '@/components/providers/PreferredLocaleProvider';
import { SnackbarProvider } from '@/components/SnackbarProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NetZeroPlanner',
  description:
    'NetZeroPlanner is an innovative tool designed to help cities achieve climate goals by tracking emissions, forecasting reductions, and evaluating potential actions. Achieve net-zero with our powerful, data-driven platform. Powered by Kausal Open Source in partnership with NetZeroCities.',
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
  const headersList = headers();
  /**
   * Extract the preferred language from the 'accept-language' header. Languages are split by
   * a comma, but may also include a semi-colon to denote the quality factor weighting.
   * Example: "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7"
   * This code will return "en-US" as it's the first language in the list
   */
  const preferredLanguage =
    headersList.get('accept-language')?.split(',')[0]?.split(';')[0] || 'en';

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
        <PreferredLocaleProvider locale={preferredLanguage}>
          <AuthProvider session={session}>
            <ApolloWrapper>
              <AppRouterCacheProvider>
                <ThemeProvider>
                  <SnackbarProvider>
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
                  </SnackbarProvider>
                </ThemeProvider>
              </AppRouterCacheProvider>
            </ApolloWrapper>
          </AuthProvider>
        </PreferredLocaleProvider>
      </Box>
    </html>
  );
}
