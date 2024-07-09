/**
 * Prevent typescript errors by filtering an array to assert a type. Usage:
 *     array.filter(createFilterTypename<ExampleType>('ExampleTypeTypename'))
 */
export function createFilterTypename<T>(typename: string) {
  return (obj: T | any): obj is T => {
    return obj?.__typename === typename;
  };
}
