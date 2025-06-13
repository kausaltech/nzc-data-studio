'use client';

import { type RefObject, useCallback, useMemo, useRef } from 'react';

import { ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
} from '@apollo/client-integration-nextjs';
import { setContext } from '@apollo/client/link/context';
import { useSession } from 'next-auth/react';

import { createSentryLink, logOperationLink } from '@common/apollo/links';
import { GRAPHQL_CLIENT_PROXY_PATH } from '@common/constants/routes.mjs';
import { getPathsGraphQLUrl, isServer } from '@common/env';

const cache = new InMemoryCache({
  typePolicies: {
    Section: {
      keyFields: ['uuid'],
    },
    MeasureTemplate: {
      keyFields: ['uuid'],
    },
  },
});

/**
 * The current locale is passed to Apollo links as context,
 * allowing us to inject the "@locale" directive in all queries.
 */
declare module '@apollo/client' {
  export interface DefaultContext {
    sessionToken?: string;
  }
}

type AccessTokenRef = RefObject<string | null>;

const makeAuthMiddleware = (tokenRef: AccessTokenRef) => {
  return setContext((_, { headers: initialHeaders = {} }: { headers: Record<string, string> }) => {
    return {
      headers: {
        ...initialHeaders,
        ...(tokenRef.current ? { Authorization: `Bearer ${tokenRef.current}` } : {}),
      },
    };
  });
};

function makeClient(sessionTokenRef: RefObject<string | null>) {
  const uri = isServer ? getPathsGraphQLUrl() : GRAPHQL_CLIENT_PROXY_PATH;
  const httpLink = new HttpLink({
    uri,
    fetchOptions: { cache: 'no-store' },
  });

  return new ApolloClient({
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
    link: ApolloLink.from([
      logOperationLink,
      makeAuthMiddleware(sessionTokenRef),
      createSentryLink(uri),
      ...(isServer
        ? [
            new SSRMultipartLink({
              stripDefer: true,
            }),
          ]
        : []),
      httpLink,
    ]),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const session = useSession();
  const accessToken = session.status === 'authenticated' ? session.data.accessToken : null;
  const tokenRef: AccessTokenRef = useRef(accessToken);

  const client = useCallback(() => makeClient(tokenRef), [tokenRef]);
  tokenRef.current = accessToken;

  return useMemo(
    () => <ApolloNextAppProvider makeClient={client}>{children}</ApolloNextAppProvider>,
    [client, children]
  );
}
