import { gql } from '@apollo/client';

export const GET_FRAMEWORK_SETTINGS = gql`
  query GetFrameworkSettings {
    framework(identifier: "nzc") {
      id
      defaults {
        targetYear {
          min
          max
          default
        }
        baselineYear {
          min
          max
          default
        }
      }
    }
  }
`;
