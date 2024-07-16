import { gql } from '@apollo/client';

export const DELETE_FRAMEWORK_CONFIG = gql`
  mutation DeleteFramework($id: ID!) {
    deleteFrameworkConfig(id: $id) {
      ok
    }
  }
`;
