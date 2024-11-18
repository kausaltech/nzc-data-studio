'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';

import { Box } from '@mui/material';

import { InstanceControlBar } from '@/components/InstanceControlBar';
import { redirect, RedirectType } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '../loading';

type Props = {
  children: ReactNode;
};

export default function HomeLayout({ children }: Props) {
  const { status } = useSession();
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
    return redirect('/welcome', RedirectType.replace);
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
