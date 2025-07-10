import { gql } from '@apollo/client';
import { FrameworkConfigFragment } from './get-framework-config';

export const CREATE_NZC_FRAMEWORK_CONFIG = gql`
  mutation CreateNZCFramework(
    $frameworkId: ID!
    $baselineYear: Int!
    $targetYear: Int!
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
        targetYear: $targetYear
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
        ...FrameworkConfig
        # Return the updated full list of framework configs to automatically update the cache
        framework {
          id
          configs {
            ...FrameworkConfig
          }
        }
      }
    }
  }

  ${FrameworkConfigFragment}
`;
