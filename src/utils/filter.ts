/**
 * Prevent typescript errors by filtering an array to assert a type. Usage:
 *     array.filter(createFilterByTypename<ExampleType>('ExampleTypeTypename'))
 */
export function createFilterByTypename<T extends { __typename?: string }>(typename: string) {
  return (obj: { __typename?: string }): obj is T => {
    return obj?.__typename === typename;
  };
}
