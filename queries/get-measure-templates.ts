import {
  GetMeasureTemplatesQuery,
  GetMeasureTemplatesQueryVariables,
} from '@/types/__generated__/graphql';
import { getClient } from '@/utils/apollo-client';
import { gql } from '@apollo/client';

const GET_MEASURE_TEMPLATES = gql`
  query GetMeasureTemplates {
    framework(identifier: "nzc") {
      dataCollection: section(identifier: "data_collection") {
        ...MainSectionMeasures
      }
      futureAssumptions: section(identifier: "future_assumptions") {
        ...MainSectionMeasures
      }
    }
    serverDeployment {
      buildId
      gitRevision
      deploymentType
    }
  }

  fragment MainSectionMeasures on Section {
    id
    descendants {
      ...SectionFragment
    }
  }

  fragment SectionFragment on Section {
    id
    name
    path
    parent {
      id
    }
    measureTemplates {
      id
      priority
      name
      unit {
        htmlShort
        htmlLong
        short
        long
      }
      defaultValueSource
      defaultDataPoints {
        id
        year
        value
      }
    }
  }
`;

export const getMeasureTemplates = async () =>
  await getClient().query<
    GetMeasureTemplatesQuery,
    GetMeasureTemplatesQueryVariables
  >({
    query: GET_MEASURE_TEMPLATES,
    fetchPolicy: 'no-cache',
  });
