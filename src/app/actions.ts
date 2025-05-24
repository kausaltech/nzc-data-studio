'use server';

import { auth, signOut } from '@/config/auth';
import { authIssuer } from '@/constants/environment';

export async function handleBackendSignOut(currentUri: string) {
  const session = await auth();
  if (!session) return null;
  const { idToken } = session;
  await signOut({ redirect: false });
  if (!idToken) {
    return null;
  }
  const params = new URLSearchParams({
    post_logout_redirect_uri: encodeURI(currentUri),
    id_token_hint: idToken,
  });
  const redirectUri = `${authIssuer}/o/logout/?${params.toString()}`;
  return redirectUri;
}
