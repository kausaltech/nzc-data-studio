import { gql } from '@apollo/client';
import { measureDataPointFragment } from './update-measure-datapoint';

export const GET_MEASURE_TEMPLATES = gql`
  query GetMeasureTemplates($frameworkConfigId: ID!) {
    framework(identifier: "nzc") {
      id
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
    uuid
    descendants {
      ...SectionFragment
    }
  }

  fragment SectionFragment on Section {
    uuid
    name
    path
    parent {
      uuid
    }
    measureTemplates {
      id
      uuid
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
      measure(frameworkConfigId: $frameworkConfigId) {
        __typename
        id
        internalNotes
        dataPoints {
          ...MeasureDataPointFragment
        }
      }
    }
  }

  ${measureDataPointFragment}
`;
