import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/theme';
import { AppBar } from '@/components/AppBar';
import './globals.css';
import { Box } from '@mui/material';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ReactNode } from 'react';
import { auth } from '@/config/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NetZeroPaths',
  description: '...',
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <AppRouterCacheProvider>
            <ThemeProvider>
              <AppBar />
              <Box component="main" sx={{ my: 4 }}>
                {children}
              </Box>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
