import { NextRequest } from 'next/server';

import type { OIDCConfig } from '@auth/core/providers';
import type { NextAuthConfig, Session, User } from 'next-auth';
import NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';

import { getAuthIssuer } from '@common/env/runtime';
import { getLogger, userLogContext } from '@common/logging/logger';

type Profile = {
  name: string;
  id: string;
  given_name: string;
  family_name: string;
  iat: number;
  sub?: string;
  email?: string;
};

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    accessToken?: string;
    idToken?: string;
    expiresAt?: number;
    refreshToken?: string;
    accessTokenLastCheckedAt: number;
    error?: 'RefreshTokenError';
    user: {
      name?: string | null;
      email?: string | null;
      id?: string;
    };
  }
}

declare module 'next-auth' {
  interface User {
    name?: string | null;
    email?: string | null;
    id?: string;
  }
  interface Session {
    accessToken: string;
    accessTokenExpiresAt: number;
    idToken?: string;
    needsRefresh?: boolean;
    performRefresh?: boolean;
    error: 'RefreshTokenError' | 'InvalidAccessToken' | 'AccessTokenNeedsRefresh' | null;
    user: User;
  }
}

const REFRESH_LEEWAY_MINS = 0;
const CHECK_ACCESS_TOKEN_INTERVAL_MINS = 60;

function getAuthLogger(opts?: { user?: User }) {
  return getLogger('auth', userLogContext(opts?.user ?? null));
}

function accessTokenNeedsRefresh(token: JWT) {
  if (!token.expiresAt) return false;
  const authLogger = getAuthLogger({ user: token.user });
  const expiresAt = token.expiresAt;
  const now = Date.now() / 1000;
  const expiresIn = expiresAt - now;
  if (expiresIn < 0) {
    authLogger.info(`Token expired at ${new Date(expiresAt * 1000).toISOString()}`);
    return true;
  } else {
    authLogger.debug(`Token will expire at ${new Date(expiresAt * 1000).toISOString()}`);
  }
  if (expiresIn - REFRESH_LEEWAY_MINS * 60 < 0) {
    return true;
  }
  return false;
}

async function checkToken(token: string) {
  const authLogger = getAuthLogger();
  const response = await fetch(`${getAuthIssuer()}/o/introspect/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      client_id: process.env.AUTH_CLIENT_ID!,
      client_secret: process.env.AUTH_CLIENT_SECRET!,
      token: token,
    }),
  });
  const data = (await response.json()) as { active: boolean };
  authLogger.debug(data, 'Introspection response');
  if (!response.ok) throw new Error('Token introspection failed');
  if (!data.active) {
    authLogger.debug('Token is not valid');
    return false;
  }
  return true;
}

async function checkAccessToken(token: JWT) {
  const { accessToken, accessTokenLastCheckedAt } = token;
  const authLogger = getAuthLogger({ user: token.user });

  const now = Date.now() / 1000;
  if (now - accessTokenLastCheckedAt < CHECK_ACCESS_TOKEN_INTERVAL_MINS * 60) {
    return true;
  }
  try {
    authLogger.debug(`Checking access token ${accessToken}`);
    const isValid = checkToken(accessToken!);
    token.accessTokenLastCheckedAt = Date.now() / 1000;
    return isValid;
  } catch (error) {
    authLogger.error(error, 'Unable to check access token validity');
    return false;
  }
}

export async function refreshAccessToken(token: JWT) {
  const refreshToken = token.refreshToken ?? (token.refresh_token as string | undefined);
  if (!refreshToken) throw new Error('Missing refresh_token');
  const authLogger = getAuthLogger({ user: token.user });

  const response = await fetch(`${getAuthIssuer()}/o/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      client_id: process.env.AUTH_CLIENT_ID!,
      client_secret: process.env.AUTH_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });
  const tokensOrError = (await response.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };
  authLogger.debug(tokensOrError, 'Refresh response');
  if (!response.ok) throw new Error('Token refresh failed');

  const newTokens = tokensOrError as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };
  token.accessToken = newTokens.access_token;
  token.refreshToken = newTokens.refresh_token;
  token.expiresAt = Math.floor(Date.now() / 1000 + newTokens.expires_in);
  token.accessTokenLastCheckedAt = Date.now() / 1000;
  authLogger.debug(token, 'Setting new token values after refresh');
}

export const AUTH_PROVIDER_NAME = 'paths-oidc-provider';

const authConfig: NextAuthConfig = {
  callbacks: {
    async jwt(resp) {
      const { token, account, user, profile } = resp;
      const authLogger = getAuthLogger({ user: user ?? token.user });
      authLogger.debug(`JWT callback [${Object.getOwnPropertyNames(resp).join(', ')}]`);
      const session = resp.session as Session;
      if (session?.performRefresh) {
        session.performRefresh = false;
        try {
          await refreshAccessToken(token);
        } catch (error) {
          authLogger.error(error, 'Unable to refresh access token');
          authLogger.debug({ refreshToken: token.refreshToken }, `Refresh token`);
          token.error = 'RefreshTokenError';
          return token;
        }
      } else {
        token.error = undefined;
      }
      if (!account) return token;
      // Sign-in flow; save the `access_token`, its expiry and the `refresh_token`
      const updatedToken: JWT = {
        ...token,
        idToken: account.id_token,
        accessToken: account.access_token,
        expiresAt: account.expires_at,
        refreshToken: account.refresh_token,
        accessTokenLastCheckedAt: (profile?.iat as number | undefined) ?? Date.now() / 1000,
        user: {
          name: user.name,
          email: user.email,
          id: account.providerAccountId,
        },
      };
      authLogger.debug({ token: JSON.stringify(updatedToken) }, 'updated token');
      return updatedToken;
    },
    async session(params: { session: Session; token: JWT; user: User }) {
      const { session, token } = params;
      const authLogger = getAuthLogger({ user: session?.user ?? token.user ?? params.user });
      authLogger.info('Session callback');

      if (!token) return session;

      if (token.error) {
        session.error = token.error;
        return session;
      }

      const { accessToken, idToken } = token;
      if (!accessToken) return session;

      if (accessTokenNeedsRefresh(token)) {
        session.needsRefresh = true;
        session.error = 'AccessTokenNeedsRefresh';
        return session;
      }
      if (!(await checkAccessToken(token))) {
        session.needsRefresh = true;
        session.error = 'InvalidAccessToken';
        return session;
      }

      session.accessToken = accessToken;
      session.accessTokenExpiresAt = token.expiresAt!;
      session.idToken = idToken;
      session.needsRefresh = false;
      session.error = null;
      if (token.user.id) {
        session.user = {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
        };
      }
      return session;
    },
  },
  logger: {
    error(error: Error) {
      const authLogger = getAuthLogger();
      authLogger.error(error);
    },
    debug(_message, _metadata) {
      const authLogger = getAuthLogger();
      authLogger.debug(_metadata, _message);
      return;
    },
    warn(code) {
      const authLogger = getAuthLogger();
      authLogger.warn({ code }, 'Auth.js warning');
    },
  },
  providers: [
    {
      id: AUTH_PROVIDER_NAME,
      name: 'Kausal Paths Provider',
      type: 'oidc',
      issuer: getAuthIssuer(),
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
      idToken: true,
      profile(profile) {
        return {
          name: profile.name,
          id: profile.sub,
          email: profile.email,
        };
      },
      wellKnown: `${getAuthIssuer()}/.well-known/openid-configuration`,
    } satisfies OIDCConfig<Profile>,
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
};

const nextAuth = NextAuth((_req?: NextRequest) => {
  const config: NextAuthConfig = {
    ...authConfig,
    callbacks: {
      ...authConfig.callbacks,
    },
  };
  return config;
});

function fixNextUrl(req: NextRequest) {
  const { href, origin } = req.nextUrl;
  const realOrigin = `${req.headers.get('x-forwarded-proto')}://${req.headers.get('host')}`;
  return new NextRequest(href.replace(origin, realOrigin), req);
}

export const { signIn, signOut, auth, unstable_update } = nextAuth;
export const handlers = {
  GET: async (req: NextRequest) => {
    return nextAuth.handlers.GET(fixNextUrl(req));
  },
  POST: async (req: NextRequest) => {
    return nextAuth.handlers.POST(fixNextUrl(req));
  },
};
