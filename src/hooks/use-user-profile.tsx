'use client';

import { gql, useQuery } from '@apollo/client';
import type { ProfileQuery } from '@/types/__generated__/graphql';
import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { FRAMEWORK_ADMIN_ROLE } from '@/constants/roles';
import { usePlans } from '@/components/providers/SelectedPlanProvider';
import { useSession } from 'next-auth/react';


type UserProfileContextType = {
  loading: boolean;
  profile: ProfileQuery | null;
}

const UserProfileContext = createContext<UserProfileContextType>({
  loading: false,
  profile: null,
});

const PROFILE_QUERY = gql`
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
`;

function useUserProfileQuery() {
  const session = useSession();
  const queryResult = useQuery<ProfileQuery>(PROFILE_QUERY, {skip: session.status !== 'authenticated'});
  return queryResult;
}

export function UserProfileProvider({ children }: PropsWithChildren) {
  const queryResult = useUserProfileQuery();
  const profile = queryResult.data ?? null;
  const loading = queryResult.loading;

  return <UserProfileContext.Provider value={{ profile, loading }}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}

export function usePermissions() {
  const { loading, profile } = useUserProfile();
  const { selectedPlanId } = usePlans();

  const frameworkConfigPermissions = useMemo(() => {
    if (!loading && selectedPlanId) {
      return profile?.framework?.configs.find(
        (config) => config.id === selectedPlanId
      )?.userPermissions;
    }

    return undefined;
  }, [selectedPlanId, profile, loading]);

  const canCreate =
    (!loading &&
      !!profile?.framework?.userPermissions?.creatableRelatedModels.includes(
        'FrameworkConfig'
      )) ??
    false;

  return {
    isFrameworkAdmin:
      !!profile?.framework?.userRoles?.includes(FRAMEWORK_ADMIN_ROLE),
    isLoading: loading,
    create: canCreate,
    edit: frameworkConfigPermissions?.change ?? false,
    delete: frameworkConfigPermissions?.delete ?? false,
  };
}
