'use client';

import { signIn } from 'next-auth/react';
import { useEffect } from 'react';
import Loading from '../loading';

export default function SSORedirect() {
  useEffect(() => {
    void signIn('paths-oidc-provider', { callbackUrl: '/' });
  }, []);

  return <Loading />;
}
