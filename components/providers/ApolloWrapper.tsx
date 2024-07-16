'use client';

import { HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/experimental-nextjs-app-support';

import { apiUrl } from '@/constants/environment';

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

function makeClient() {
  const httpLink = new HttpLink({
    uri: `${apiUrl}/v1/graphql/`,
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
