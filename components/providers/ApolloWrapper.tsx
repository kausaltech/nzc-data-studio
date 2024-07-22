'use client';

import { HttpLink, Operation } from '@apollo/client';
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/experimental-nextjs-app-support';

import { onError } from '@apollo/client/link/error';
import { apiUrl, isDev } from '@/constants/environment';

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
    locale?: string;
    planIdentifier?: string;
    planDomain?: string;
    sessionToken?: string;
    start?: number;
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

export const errorLink = onError(
  ({ networkError, graphQLErrors, operation }) => {
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
  }
);

function makeClient() {
  const httpLink = new HttpLink({
    uri: `${apiUrl}/graphql/`,
    fetchOptions: { cache: 'no-store' },
  });

  return new ApolloClient({
    cache,
    link: httpLink,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
