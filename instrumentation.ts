import {
  apiUrl,
  authIssuer,
} from './constants/environment';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log(`
      Starting nzc-data-studio
        → NODE_ENV: ${process.env.NODE_ENV}
        → API URL: ${apiUrl}
        → Issuer URL: ${authIssuer}
    `);
  }
}
