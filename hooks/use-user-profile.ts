import { gql, useQuery } from '@apollo/client';
import { ProfileQuery } from '@/types/__generated__/graphql';

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
        userPermissions {
          change
          creatableRelatedModels
        }
      }
    }
  `);

  return queryResult;
}

export function usePermissions() {
  const profileQuery = useUserProfile();
  const canEdit = !!profileQuery.data?.framework?.userPermissions?.change;
  const canCreate =
    !!profileQuery.data?.framework?.userPermissions?.creatableRelatedModels.includes(
      'FrameworkConfig'
    );

  return {
    isLoading: profileQuery.loading,
    canEdit,
    canCreate,
  };
}
