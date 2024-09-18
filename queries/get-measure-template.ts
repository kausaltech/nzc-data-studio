import { gql } from '@apollo/client';

export const GET_MEASURE_TEMPLATE = gql`
  query GetMeasureTemplate($id: ID!, $frameworkConfigId: ID!) {
    framework(identifier: "nzc") {
      id
      measureTemplate(id: $id) {
        id
        uuid
        name
        measure(frameworkConfigId: $frameworkConfigId) {
          id
          internalNotes
          dataPoints {
            id
            value
            year
            defaultValue
          }
        }
      }
    }
  }
`;
