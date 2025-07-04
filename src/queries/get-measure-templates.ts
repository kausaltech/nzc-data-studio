import { gql } from '@apollo/client';
import { measureDataPointFragment } from './update-measure-datapoint';

export const GET_MEASURE_TEMPLATES = gql`
  query GetMeasureTemplates(
    $frameworkConfigId: ID!
    $includePlaceholders: Boolean = false
  ) {
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
    __typename
    uuid
    name
    maxTotal
    helpText
    path
    parent {
      uuid
    }
    measureTemplates {
      ...MeasureTemplateFragment
    }
  }

  fragment MeasureTemplateFragment on MeasureTemplate {
    id
    uuid
    priority
    name
    hidden
    yearBound
    helpText
    minValue
    maxValue
    includeInProgressTracker
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
      placeholderDataPoints @include(if: $includePlaceholders) {
        __typename
        year
        value
      }
      dataPoints {
        ...DataPointFragment
      }
    }
  }

  ${measureDataPointFragment}
`;
