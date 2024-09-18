import { gql } from '@apollo/client';

export const CREATE_NZC_FRAMEWORK_CONFIG = gql`
  mutation CreateNZCFramework(
    $frameworkId: ID!
    $baselineYear: Int!
    $population: Int!
    $name: String!
    $slug: ID!
    $temperature: LowHigh!
    $renewableMix: LowHigh!
  ) {
    createNzcFrameworkConfig(
      configInput: {
        frameworkId: $frameworkId
        baselineYear: $baselineYear
        name: $name
        instanceIdentifier: $slug
      }
      nzcData: {
        population: $population
        temperature: $temperature
        renewableMix: $renewableMix
      }
    ) {
      ok
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
