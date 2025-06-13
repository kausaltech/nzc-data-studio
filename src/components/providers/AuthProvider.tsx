'use client';

import type { RefObject, ReactNode} from 'react';
import { useEffect, useRef } from 'react';

import type { Session } from 'next-auth';
import type {
  UpdateSession} from 'next-auth/react';
import {
  __NEXTAUTH,
  SessionProvider,
  signIn,
  useSession,
} from 'next-auth/react';

import Loading from '@/app/loading';
import { AUTH_PROVIDER_NAME } from '@/config/auth';
import { getLogger } from '@common/logging';


async function refreshAccessToken(
  update: UpdateSession,
  isRefreshing: RefObject<boolean>
) {
  const logger = getLogger('refreshAccessToken');
  logger.info('Refreshing the token by updating the session');
  const newSession = await update({ performRefresh: true });
  logger.info(newSession, 'Refresh done');
  isRefreshing.current = false;
}

function TokenRefresher({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();

  const logger = getLogger('TokenRefresher');

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
    `status=${status}; needsRefresh=${needsRefresh}; refreshing=${refreshing.current}; performRefresh=${session?.performRefresh} ${sessionStr}`
  );

  useEffect(() => {
    if (!needsRefresh || refreshing.current || session?.performRefresh) return;
    refreshing.current = true;
    logger.info('Invoking refresh');
    void refreshAccessToken(update, refreshing);
  }, [needsRefresh, refreshing, session?.performRefresh, update, logger]);

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
      void refreshAccessToken(update, refreshing);
    }, timeLeft * 1000);
    return () => clearTimeout(refetchTimer);
  }, [session?.accessTokenExpiresAt, refreshing, update, logger]);

  if (needsSignIn) {
    logger.info('Performing sign-in');
    void signIn(AUTH_PROVIDER_NAME, {});
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
