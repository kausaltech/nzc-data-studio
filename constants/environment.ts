export const isDev = process.env.NODE_ENV === 'development';

export const authTestPassword = isDev
  ? process.env.AUTH_TEST_PASSWORD
  : undefined;
