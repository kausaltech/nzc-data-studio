/**
 * Prevent typescript errors by filtering an array to assert a type. Usage:
 *     array.filter(createFilterByTypename<ExampleType>('ExampleTypeTypename'))
 */
export function createFilterByTypename<T>(typename: string) {
  return (obj: T | any): obj is T => {
    return obj?.__typename === typename;
  };
}
