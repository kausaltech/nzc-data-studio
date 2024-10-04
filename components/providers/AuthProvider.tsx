'use client';

import { MutableRefObject, ReactNode, useEffect, useRef } from 'react';

import { Session } from 'next-auth';
import {
  __NEXTAUTH,
  SessionProvider,
  signIn,
  UpdateSession,
  useSession,
} from 'next-auth/react';

import Loading from '@/app/loading';
import { AUTH_PROVIDER_NAME } from '@/config/auth';
import logger from '@/utils/logger';

async function refreshAccessToken(
  update: UpdateSession,
  isRefreshing: MutableRefObject<boolean>
) {
  logger.info('Refreshing the token by updating the session');
  const newSession = await update({ performRefresh: true });
  logger.info(newSession, 'Refresh done');
  isRefreshing.current = false;
}

function TokenRefresher({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();

  const sessionStr = session
    ? `error: ${session.error ?? '[no error]'}, accessToken: ${session.accessToken?.substring(0, 5)}...`
    : '[no session]';

  let needsRefresh = false,
    needsSignIn = false;

  if (status === 'authenticated' && session) {
    if (session.error === 'RefreshTokenError') {
      needsSignIn = true;
    } else if (session.needsRefresh) {
      needsRefresh = true;
    }
  }

  const refreshing = useRef(false);

  logger.info(
    `[TokenRefresher] status=${status}; needsRefresh=${needsRefresh}; refreshing=${refreshing.current}; performRefresh=${session?.performRefresh} ${sessionStr}`
  );

  useEffect(() => {
    if (!needsRefresh || refreshing.current || session?.performRefresh) return;
    refreshing.current = true;
    logger.info('Invoking refresh');
    refreshAccessToken(update, refreshing);
  }, [needsRefresh, refreshing, session?.performRefresh, update]);

  useEffect(() => {
    if (!session?.accessTokenExpiresAt || refreshing.current) return;

    const now = Date.now() / 1000;
    // Refresh the access token about 10 mins before it's scheduled to expire,
    // and add a bit of jitter to decrease the likelihood of different browser
    // tabs trying to refresh at once.
    // The session update event will be broadcast through a BroadcastChannel
    // to other tabs.
    const timeLeft =
      Math.max(session.accessTokenExpiresAt - now - 600, 60) +
      Math.random() * 60;
    logger.info(`Refreshing token after ${timeLeft}s`);
    const refetchTimer = setTimeout(() => {
      logger.info('Refresh timer fired');
      refreshing.current = true;
      refreshAccessToken(update, refreshing);
    }, timeLeft * 1000);
    return () => clearTimeout(refetchTimer);
  }, [session?.accessTokenExpiresAt, refreshing, update]);

  if (needsSignIn) {
    logger.info('Performing sign-in');
    signIn(AUTH_PROVIDER_NAME, {});
  }

  if (needsRefresh || needsSignIn) {
    return <Loading />;
  }
  return children;
}

type Props = {
  children: ReactNode;
  session: Session | null;
};

export function AuthProvider({ session, children }: Props) {
  logger.child({ user: session?.user }).info('AuthProvider init');
  return (
    <SessionProvider
      session={session}
      refetchInterval={7200}
      refetchWhenOffline={false}
    >
      <TokenRefresher>{children}</TokenRefresher>
    </SessionProvider>
  );
}
