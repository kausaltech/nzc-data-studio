'use client';

import { gql } from '@apollo/client';

export const measureDataPointFragment = gql`
  fragment MeasureDataPointFragment on MeasureDataPoint {
    __typename
    id
    value
    year
  }
`;

export const UPDATE_MEASURE_DATAPOINT = gql`
  mutation UpdateMeasureDataPoint(
    $frameworkInstanceId: ID!
    $measureTemplateId: ID!
    $internalNotes: String
    $value: Float!
  ) {
    updateMeasureDataPoint(
      frameworkInstanceId: $frameworkInstanceId
      measureTemplateId: $measureTemplateId
      internalNotes: $internalNotes
      value: $value
    ) {
      measureDataPoint {
        ...MeasureDataPointFragment
      }
    }
  }

  ${measureDataPointFragment}
`;
