import {
  GetFrameworkConfigQuery,
  GetFrameworkConfigQueryVariables,
} from '@/types/__generated__/graphql';
import { getClient } from '@/utils/apollo-client';
import { gql } from '@apollo/client';

const GET_FRAMEWORK_CONFIG = gql`
  query GetFrameworkConfig($identifier: ID!, $id: ID!) {
    framework(identifier: $identifier) {
      id
      config(id: $id) {
        id
        organizationName
        baselineYear
      }
      configs {
        id
        organizationName
        baselineYear
      }
    }
  }
`;

export const getFrameworkConfig = async (identifier: string, id: string) =>
  await getClient().query<
    GetFrameworkConfigQuery,
    GetFrameworkConfigQueryVariables
  >({
    query: GET_FRAMEWORK_CONFIG,
    variables: { identifier, id },
    fetchPolicy: 'no-cache',
  });
