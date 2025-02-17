import { gql, useQuery } from '@apollo/client';
import { ProfileQuery } from '@/types/__generated__/graphql';
import { useMemo } from 'react';
import { FRAMEWORK_ADMIN_ROLE } from '@/constants/roles';
import { useSelectedPlanId } from '@/components/providers/SelectedPlanProvider';
import { FrameworkConfigFragment } from '@/queries/framework/get-framework-config';

export function useUserProfile() {
  const { selectedPlanId } = useSelectedPlanId();

  const queryResult = useQuery<ProfileQuery>(
    gql`
      query Profile($selectedPlanId: ID!) {
        me {
          id
          email
          firstName
          lastName
          frameworkRoles {
            roleId
            orgSlug
            orgId
          }
        }

        framework(identifier: "nzc") {
          id
          userRoles
          userPermissions {
            change
            creatableRelatedModels
          }
          config(id: $selectedPlanId) {
            ...FrameworkConfig
            userPermissions {
              view
              change
              delete
              actions
              creatableRelatedModels
              otherPermissions
            }
          }
        }
      }
      ${FrameworkConfigFragment}
    `,
    {
      variables: {
        selectedPlanId,
      },
    }
  );

  return queryResult;
}

export function usePermissions() {
  const { loading, data } = useUserProfile();

  const frameworkConfigPermissions = !loading
    ? data?.framework?.config?.userPermissions
    : undefined;

  const canCreate =
    (!loading &&
      !!data?.framework?.userPermissions?.creatableRelatedModels.includes(
        'FrameworkConfig'
      )) ??
    false;

  return {
    isFrameworkAdmin:
      !!data?.framework?.userRoles?.includes(FRAMEWORK_ADMIN_ROLE),
    isLoading: loading,
    create: canCreate,
    edit: frameworkConfigPermissions?.change ?? false,
    delete: frameworkConfigPermissions?.delete ?? false,
  };
}
