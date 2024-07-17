import { gql } from '@apollo/client';

export const GET_FRAMEWORK_CONFIG = gql`
  query GetFrameworkConfig($id: ID!) {
    framework(identifier: "nzc") {
      id
      config(id: $id) {
        id
        organizationName
        baselineYear
      }
    }
  }
`;

export const GET_FRAMEWORK_CONFIGS = gql`
  query GetFrameworkConfigs {
    framework(identifier: "nzc") {
      id
      configs {
        id
        organizationName
        baselineYear
      }
    }
  }
`;
