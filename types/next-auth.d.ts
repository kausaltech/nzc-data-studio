import { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
    accessToken?: string;
    expiresAt?: number;
    refreshToken?: string;
    error?: 'RefreshTokenError';
  }
}

declare module 'next-auth' {
  interface Session {
    idToken: string;
    accessToken: string;
    error?: 'RefreshTokenError';
    user: {
      name: string;
    } & DefaultSession['user'];
  }
}
