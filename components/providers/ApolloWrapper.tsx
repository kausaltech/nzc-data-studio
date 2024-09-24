'use client';

import { ApolloLink, HttpLink, Operation } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support';
import { useSession } from 'next-auth/react';

import { apiUrl, isDev, isServer } from '@/constants/environment';

// TODO: Add when Sentry is merged
// import { captureException } from '@sentry/nextjs';

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
    console.error(
      `An error occurred while querying ${operation.operationName}: ${message}`,
      error
    );
  }

  // TODO: Add when Sentry is merged
  // captureException(message, {
  //   extra: {
  //     query: operation.query,
  //     operationName: operation.operationName,
  //     variables: JSON.stringify(operation.variables, null, 2),
  //     ...sentryExtras,
  //   },
  // });
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

const authMiddleware = setContext(
  (_, { sessionToken, headers: initialHeaders = {} }) => {
    return {
      headers: {
        ...initialHeaders,
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
      },
    };
  }
);

function makeClient(sessionToken?: string) {
  const httpLink = new HttpLink({
    uri: `${apiUrl}/graphql/`,
    fetchOptions: { cache: 'no-store' },
  });

  return new ApolloClient({
    defaultContext: {
      sessionToken,
    },

    cache,
    link: ApolloLink.from([
      errorLink,
      authMiddleware,
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
  const token =
    session.status === 'authenticated' ? session.data.accessToken : undefined;

  return (
    <ApolloNextAppProvider makeClient={() => makeClient(token)}>
      {children}
    </ApolloNextAppProvider>
  );
}
