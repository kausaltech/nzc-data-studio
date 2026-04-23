import { gql, useMutation } from '@apollo/client';

import type {
  SetInstanceLockedMutation,
  SetInstanceLockedMutationVariables,
} from '@/types/__generated__/graphql';

export const SET_INSTANCE_LOCKED = gql`
  mutation SetInstanceLocked($instanceId: ID!, $isLocked: Boolean!) {
    setInstanceLocked(instanceId: $instanceId, isLocked: $isLocked) {
      __typename
    }
  }
`;

export function useSetInstanceLocked(frameworkConfigId?: string) {
  return useMutation<SetInstanceLockedMutation, SetInstanceLockedMutationVariables>(
    SET_INSTANCE_LOCKED,
    {
      update(cache, _result, { variables }) {
        if (!variables || !frameworkConfigId) return;

        cache.modify({
          id: cache.identify({ __typename: 'FrameworkConfig', id: frameworkConfigId }),
          fields: {
            isLocked: () => variables.isLocked,
          },
        });
      },
    }
  );
}
