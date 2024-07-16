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
    jwt({ token, account, profile }) {
      // Persist the OAuth id_token
      if (account?.id_token) {
        token.idToken = account.id_token;
        if (typeof profile?.exp == 'number') {
          token.expires = new Date(profile.exp * 1000).toISOString();
        }
      }

      return token;
    },
    session({ session, ...params }) {
      // Include the OAuth id_token in the session
      if ('token' in params && typeof params.token.idToken === 'string') {
        session.idToken = params.token.idToken;

        // if (params.token.expires != null) {
        //   session.expires = new Date(params.token.expires).toDateString();
        // }
      }
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
