import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { signOut } from '@/config/auth';
import { authIssuer } from '@/constants/environment';

export function useHandleSignOut() {
  const router = useRouter();

  return useCallback(() => {
    signOut({ redirect: false });

    /**
     * Redirect to the Admin UI logout page so that the session can be cleared.
     * The user will be redirected back to the `next` query parameter.
     */
    router.push(`${authIssuer}/logout?next=${encodeURI(window.location.href)}`);
  }, [router]);
}
