'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { InstanceControlBar } from '@/components/InstanceControlBar';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '../loading';

type Props = {
  children: ReactNode;
};

export default function HomeLayout({ children }: Props) {
  const { status } = useSession();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(
    status === 'authenticated'
  );

  useEffect(() => {
    if (status === 'authenticated') {
      setIsAuthenticated(true);
    } else if (status === 'unauthenticated') {
      setIsAuthenticated(false);
      router.replace('/welcome');
    }
  }, [status, router]);

  if ((!isAuthenticated && status === 'loading')) {
    return <Loading />;
  }

  return (
    <>
      <Box sx={{ mt: -4 }}>
        <InstanceControlBar />
      </Box>
      <Box sx={{ mt: 4 }}>{children}</Box>
    </>
  );
}
