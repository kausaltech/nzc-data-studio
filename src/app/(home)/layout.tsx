'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Box } from '@mui/material';
import { useSession } from 'next-auth/react';

import { InstanceControlBar } from '@/components/InstanceControlBar';
import {
  INTRO_MODAL_VIEWED_KEY,
  IntroModal,
  persistIntroModalViewed,
} from '@/components/IntroModal';

import Loading from '../loading';

type Props = {
  children: ReactNode;
};

function isIntroModalViewed() {
  try {
    return localStorage.getItem(INTRO_MODAL_VIEWED_KEY) === 'true';
  } catch {
    return true;
  }
}

export default function HomeLayout({ children }: Props) {
  const { status } = useSession();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(
    status === 'authenticated'
  );
  const [introModalOpen, setIntroModalOpen] = useState(false);

  useEffect(() => {
    setIntroModalOpen(!isIntroModalViewed());
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      setIsAuthenticated(true);
    } else if (status === 'unauthenticated') {
      setIsAuthenticated(false);
      router.replace('/welcome');
    }
  }, [status, router]);

  if (!isAuthenticated && status === 'loading') {
    return <Loading />;
  }

  function handleIntroModalClose() {
    persistIntroModalViewed();
    setIntroModalOpen(false);
  }

  return (
    <>
      <IntroModal open={introModalOpen} onClose={handleIntroModalClose} />
      <Box sx={{ mt: -4 }}>
        <InstanceControlBar />
      </Box>
      <Box sx={{ mt: 4 }}>{children}</Box>
    </>
  );
}
