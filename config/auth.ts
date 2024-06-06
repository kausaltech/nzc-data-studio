import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { authTestPassword, isDev } from '@/constants/environment';

const MOCK_PROVIDER = Credentials({
  id: 'password',
  name: 'Password',
  credentials: {
    password: { label: 'Password', type: 'password' },
  },
  authorize: (credentials) => {
    if (credentials.password === authTestPassword) {
      return {
        email: 'test@example.com',
        name: 'Kasimir Kausal',
      };
    }

    return null;
  },
});

const providers = !isDev ? [] : [MOCK_PROVIDER];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
});
