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
    }
  `);

  return queryResult;
}
