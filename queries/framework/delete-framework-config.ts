import {
  DeleteFrameworkConfigMutation,
  DeleteFrameworkConfigMutationVariables,
} from '@/types/__generated__/graphql';
import { getClient } from '@/utils/apollo-client';
import { gql } from '@apollo/client';

const DELETE_FRAMEWORK_CONFIG = gql`
  mutation DeleteFrameworkConfig($id: ID!) {
    deleteFrameworkConfig(id: $id) {
      ok
    }
  }
`;

export const deleteFrameworkConfig = async (id: string) =>
  await getClient().mutate<
    DeleteFrameworkConfigMutation,
    DeleteFrameworkConfigMutationVariables
  >({
    mutation: DELETE_FRAMEWORK_CONFIG,
    variables: { id },
  });
