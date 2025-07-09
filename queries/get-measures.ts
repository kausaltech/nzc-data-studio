import { gql } from '@apollo/client';

const MEASURE_FRAGMENT = gql`
  fragment MeasureFragment on Measure {
    id
    internalNotes
    measureTemplate {
      uuid
    }
    dataPoints {
      value
      year
    }
  }
`;

export const GET_MEASURES = gql`
  query GetMeasures($id: ID!) {
    framework(identifier: "nzc") {
      config(id: $id) {
        measures {
          ...MeasureFragment
        }
      }
    }
  }

  ${MEASURE_FRAGMENT}
`;
