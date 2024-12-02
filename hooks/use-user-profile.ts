import { gql, useQuery } from '@apollo/client';
import { ProfileQuery } from '@/types/__generated__/graphql';
import useStore from '@/store/use-store';
import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import { useMemo } from 'react';
import { FRAMEWORK_ADMIN_ROLE } from '@/constants/roles';

export function useUserProfile() {
  const queryResult = useQuery<ProfileQuery>(gql`
    query Profile {
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
        configs {
          __typename
          id
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
  `);

  return queryResult;
}

export function usePermissions() {
  const { loading, data } = useUserProfile();
  const { data: selectedInstanceId, isDataInitialized } = useStore(
    useFrameworkInstanceStore,
    (state) => state.selectedInstance
  );

  const frameworkConfigPermissions = useMemo(() => {
    if (!loading && isDataInitialized && selectedInstanceId) {
      return data?.framework?.configs.find(
        (config) => config.id === selectedInstanceId
      )?.userPermissions;
    }

    return undefined;
  }, [isDataInitialized, selectedInstanceId, data, loading]);

  const canCreate =
    (!loading &&
      !!data?.framework?.userPermissions?.creatableRelatedModels.includes(
        'FrameworkConfig'
      )) ??
    false;

  return {
    isFrameworkAdmin:
      !!data?.framework?.userRoles?.includes(FRAMEWORK_ADMIN_ROLE),
    isLoading: !isDataInitialized || loading,
    create: canCreate,
    edit: frameworkConfigPermissions?.change ?? false,
    delete: frameworkConfigPermissions?.delete ?? false,
  };
}
