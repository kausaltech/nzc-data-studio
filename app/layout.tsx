import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/theme';
import { AppBar } from '@/components/AppBar';
import { Box } from '@mui/material';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { auth } from '@/config/auth';
import { envMetadata } from '@/utils/environment';
import { ApolloWrapper } from '@/components/providers/ApolloWrapper';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NetZeroPaths',
  description: '...',
  ...envMetadata,
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <AuthProvider session={session}>
            <AppRouterCacheProvider>
              <ThemeProvider>
                <AppBar />
                <Box component="main" sx={{ my: 8 }}>
                  {children}
                </Box>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
