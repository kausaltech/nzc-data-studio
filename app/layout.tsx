import './globals.css';

import { ReactNode } from 'react';
import { cookies, headers } from 'next/headers';

import { Box, Container } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import * as Sentry from '@sentry/nextjs';
import type { Metadata } from 'next';

import { AppBar } from '@/components/AppBar';
import { Logo } from '@/components/Logo';
import { ApolloWrapper } from '@/components/providers/ApolloWrapper';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { PreferredLocaleProvider } from '@/components/providers/PreferredLocaleProvider';
import { SnackbarProvider } from '@/components/SnackbarProvider';
import { auth } from '@/config/auth';
import { ThemeProvider } from '@/theme';
import { envMetadata } from '@/utils/environment';
import { SelectedPlanProvider } from '@/components/providers/SelectedPlanProvider';
import { PLAN_COOKIE_KEY } from '@/constants/plan';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

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
  if (session) {
    const { email, id, name } = session.user;
    Sentry.setUser({
      email: email ?? undefined,
      id: id ?? undefined,
      name: name,
    });
  } else {
    Sentry.setUser(null);
  }

  const cookieStore = await cookies();
  const selectedPlan = cookieStore.get(PLAN_COOKIE_KEY);
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
        sx={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PreferredLocaleProvider locale={preferredLanguage}>
          <SelectedPlanProvider plan={selectedPlan?.value}>
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
          </SelectedPlanProvider>
        </PreferredLocaleProvider>
      </Box>
    </html>
  );
}
