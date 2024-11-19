'use client';

import { ReactNode, useEffect, useState } from 'react';

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
    }
  }, [status]);

  if (!isAuthenticated && status === 'loading') {
    return <Loading />;
  }

  if (status === 'unauthenticated') {
    return router.replace('/welcome');
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
