import NextAuth from 'next-auth';
import type { OIDCConfig } from '@auth/core/providers';
import { authIssuer } from '@/constants/environment';

type Profile = {
  name: string;
  given_name: string;
  family_name: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // First-time login, save the `access_token`, its expiry and the `refresh_token`
        return {
          ...token,
          idToken: account.id_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        };
      } else if (token.expires_at && Date.now() < token.expires_at * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token;
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new TypeError('Missing refresh_token');

        try {
          const response = await fetch(`${authIssuer}/o/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'application/json',
            },
            body: new URLSearchParams({
              client_id: process.env.AUTH_CLIENT_ID!,
              client_secret: process.env.AUTH_CLIENT_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token,
            }),
          });

          const tokensOrError = await response.json();

          if (!response.ok) throw tokensOrError;

          const newTokens = tokensOrError as {
            access_token: string;
            expires_in: number;
            refresh_token?: string;
          };

          token.access_token = newTokens.access_token;
          token.expires_at = Math.floor(
            Date.now() / 1000 + newTokens.expires_in
          );
          // Some providers only issue refresh tokens once, so preserve if we did not get a new one
          if (newTokens.refresh_token)
            token.refresh_token = newTokens.refresh_token;

          return token;
        } catch (error) {
          console.error('Error refreshing access_token', error);
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = 'RefreshTokenError';
          return token;
        }
      }
    },
    session({ session, token }) {
      // Include the OAuth id_token in the session
      if (typeof token?.idToken === 'string') {
        session.idToken = token.idToken;
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
