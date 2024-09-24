import type { OIDCConfig } from '@auth/core/providers';
import NextAuth from 'next-auth';

import { authIssuer } from '@/constants/environment';

type Profile = {
  name: string;
  given_name: string;
  family_name: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async jwt(resp) {
      console.debug('jwt callback');
      console.debug(resp);
      const { token, account } = resp;
      if (account) {
        // First-time login, save the `access_token`, its expiry and the `refresh_token`
        return {
          ...token,
          idToken: account.id_token,
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          refreshToken: account.refresh_token,
        };
      } else if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
        // Subsequent session refresh, but the `access_token` is still valid
        return token;
      } else {
        // Subsequent session refersh, but the `access_token` has expired, try to get a new one

        // TODO: Remove reference to refresh_token later; it is there to convert older sessions.
        const refreshToken = token.refreshToken ?? (token.refresh_token as string | undefined);
        if (!refreshToken) throw new TypeError('Missing refresh_token');

        try {
          const response = await fetch(`${authIssuer}/o/token/`, {
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
          const tokensOrError = await response.json();
          console.debug('refresh response:');
          console.debug(tokensOrError);
          if (!response.ok) throw tokensOrError;

          const newTokens = tokensOrError as {
            access_token: string;
            expires_in: number;
            refresh_token?: string;
          };

          token.accessToken = newTokens.access_token;
          token.expiresAt = Math.floor(
            Date.now() / 1000 + newTokens.expires_in
          );
          // Some providers only issue refresh tokens once, so preserve if we did not get a new one
          if (newTokens.refresh_token)
            token.refreshToken = newTokens.refresh_token;

          return token;
        } catch (error) {
          console.error('Error refreshing access_token', error);
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = 'RefreshTokenError';
          token.refreshToken = undefined;
          return token;
        }
      }
    },
    session({ session, token }) {
      if (!token) return session;

      const { idToken, accessToken } = token;
      // Include the OAuth id_token in the session
      if (idToken) {
        session.idToken = idToken;
      }
      if (accessToken) {
        session.accessToken = accessToken;
      }

      session.error = token.error;

      return session;
    },
  },
  providers: [
    {
      id: 'paths-oidc-provider',
      name: 'Kausal Paths Provider',
      type: 'oidc',
      issuer: authIssuer,
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      profile(profile) {
        return { name: profile.name };
      },
      wellKnown: `${authIssuer}/.well-known/openid-configuration`,
    } satisfies OIDCConfig<Profile>,
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
