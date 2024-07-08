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
      name
      unit {
        htmlShort
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

export const getMeasureTemplates = async (framework: string) =>
  await getClient().query({
    query: GET_MEASURE_TEMPLATES,
    variables: { framework },
    fetchPolicy: 'no-cache',
  });
