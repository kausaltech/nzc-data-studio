import { getPublicEnvVariables } from '@/utils/environment';

export const isDev = process.env.NODE_ENV === 'development';

export const authTestPassword = isDev
  ? process.env.AUTH_TEST_PASSWORD
  : undefined;

export const isServer = typeof window === 'undefined';

export const publicEnvVars = getPublicEnvVariables();

export const apiUrl = publicEnvVars.KAUSAL_PUBLIC_API_URL;
