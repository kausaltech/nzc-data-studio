import { gql } from '@apollo/client';

export const FrameworkConfigFragment = gql`
  fragment FrameworkConfig on FrameworkConfig {
    id
    organizationName
    baselineYear
    targetYear
    viewUrl
    resultsDownloadUrl
  }
`;

export const GET_FRAMEWORK_CONFIGS = gql`
  query GetFrameworkConfigs {
    framework(identifier: "nzc") {
      id
      configs {
        ...FrameworkConfig
      }
    }
  }

  ${FrameworkConfigFragment}
`;
