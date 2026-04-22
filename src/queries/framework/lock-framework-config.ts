import { gql } from '@apollo/client';

export const LOCK_FRAMEWORK_CONFIG = gql`
  mutation LockFrameworkConfig($id: ID!, $locked: Boolean!) {
    updateFrameworkConfig(id: $id, locked: $locked) {
      ok
      frameworkConfig {
        id
        locked
      }
    }
  }
`;

// TODO: Remove this when backend support ready
export interface LockFrameworkConfigMutation {
  updateFrameworkConfig: {
    ok: boolean | null;
    frameworkConfig: { id: string; locked: boolean } | null;
  } | null;
}

export interface LockFrameworkConfigMutationVariables {
  id: string;
  locked: boolean;
}
