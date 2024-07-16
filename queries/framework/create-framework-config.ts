import {
  CreateFrameworkConfigMutation,
  CreateFrameworkConfigMutationVariables,
} from '@/types/__generated__/graphql';
import { getClient } from '@/utils/apollo-client';
import { gql } from '@apollo/client';

const CREATE_FRAMEWORK_CONFIG = gql`
  mutation CreateFrameworkConfig(
    $frameworkId: ID!
    $baselineYear: Int!
    $name: String!
  ) {
    createFrameworkConfig(
      frameworkId: $frameworkId
      baselineYear: $baselineYear
      name: $name
    ) {
      frameworkConfig {
        id
        organizationName
        baselineYear
      }
    }
  }
`;

export const createFrameworkConfig = async (
  frameworkId: string,
  baselineYear: number,
  name: string
) =>
  await getClient().mutate<
    CreateFrameworkConfigMutation,
    CreateFrameworkConfigMutationVariables
  >({
    mutation: CREATE_FRAMEWORK_CONFIG,
    variables: { frameworkId, baselineYear, name },
  });
