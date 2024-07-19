import { gql } from '@apollo/client';

export const CREATE_FRAMEWORK_CONFIG = gql`
  mutation CreateFramework(
    $frameworkId: ID!
    $baselineYear: Int!
    $name: String!
    $slug: ID!
  ) {
    createFrameworkConfig(
      frameworkId: $frameworkId
      baselineYear: $baselineYear
      name: $name
      instanceIdentifier: $slug
    ) {
      frameworkConfig {
        id
        organizationName
        baselineYear
        viewUrl
        resultsDownloadUrl
        # Return the updated full list of framework configs to automatically update the cache
        framework {
          id
          configs {
            id
            viewUrl
            resultsDownloadUrl
            organizationName
            baselineYear
          }
        }
      }
    }
  }
`;
