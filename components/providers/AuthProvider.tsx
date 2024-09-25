'use client';

import { ReactNode } from 'react';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

type Props = {
  children: ReactNode;
  session: Session | null;
};

export function AuthProvider({ children, session }: Props) {
  return <SessionProvider session={session} refetchInterval={7200} refetchWhenOffline={false}>{children}</SessionProvider>;
}
