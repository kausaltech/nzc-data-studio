import { gql } from '@apollo/client';

export const CREATE_FRAMEWORK_CONFIG = gql`
  mutation CreateFramework(
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
        # Return the updated full list of framework configs to automatically update the cache
        framework {
          id
          configs {
            id
            organizationName
            baselineYear
          }
        }
      }
    }
  }
`;
