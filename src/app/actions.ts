'use server';

import { auth, signOut } from '@/config/auth';
import { getAuthIssuer } from '@common/env';

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
  const redirectUri = `${getAuthIssuer()}/o/logout/?${params.toString()}`;
  return redirectUri;
}
