/**
 * Helper to support store local storage persistence
 * by waiting for client rendering before accessing the store
 */
import { useState, useEffect } from 'react';

const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();
  const [isDataInitialized, setIsDataInitialized] = useState<boolean>(false);

  useEffect(() => {
    setData(result);
    setIsDataInitialized(true);
  }, [result]);

  return { data, isDataInitialized };
};

export default useStore;
