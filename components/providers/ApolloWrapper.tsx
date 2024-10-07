'use client';

import { MutableRefObject, useCallback, useMemo, useRef } from 'react';

import { ApolloLink, HttpLink, Operation } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support';
import * as Sentry from '@sentry/nextjs';
import { useSession } from 'next-auth/react';

import { apiUrl, isDev, isServer } from '@/constants/environment';
import logger from '@/utils/logger';

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

function logError(
  operation: Operation,
  message: string,
  error: unknown,
  sentryExtras: { [key: string]: unknown }
) {
  if (isDev) {
    logger.error(
      error,
      `An error occurred while querying ${operation.operationName}: ${message}`
    );
  }

  Sentry.captureException(message, {
    extra: {
      query: operation.query,
      operationName: operation.operationName,
      variables: JSON.stringify(operation.variables, null, 2),
      ...sentryExtras,
    },
  });
}

const errorLink = onError(({ networkError, graphQLErrors, operation }) => {
  if (networkError) {
    logError(operation, networkError.message, networkError, {
      cause: networkError.cause,
      name: networkError.name,
    });
  }

  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      logError(operation, error.message, error, {
        errorPath: error.path,
      });
    });
  }
});

type AccessTokenRef = MutableRefObject<string | null>;

const makeAuthMiddleware = (tokenRef: AccessTokenRef) => {
  return setContext((_, { headers: initialHeaders = {} }) => {
    return {
      headers: {
        ...initialHeaders,
        ...(tokenRef.current
          ? { Authorization: `Bearer ${tokenRef.current}` }
          : {}),
      },
    };
  });
};

function makeClient(sessionTokenRef: MutableRefObject<string | null>) {
  const httpLink = new HttpLink({
    uri: `${apiUrl}/graphql/`,
    fetchOptions: { cache: 'no-store' },
  });

  return new ApolloClient({
    cache,
    link: ApolloLink.from([
      errorLink,
      makeAuthMiddleware(sessionTokenRef),
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
  const accessToken =
    session.status === 'authenticated' ? session.data.accessToken : null;
  const tokenRef: AccessTokenRef = useRef(accessToken);

  const client = useCallback(() => makeClient(tokenRef), [tokenRef]);
  tokenRef.current = accessToken;

  return useMemo(
    () => (
      <ApolloNextAppProvider makeClient={client}>
        {children}
      </ApolloNextAppProvider>
    ),
    [client, children]
  );
}
