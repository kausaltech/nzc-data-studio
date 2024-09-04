import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = {
  selectedInstance: string | null;
  name: string | null;
  baselineYear: number | null;
  setInstance: (
    instanceId: string | null,
    name?: string,
    baselineYear?: number
  ) => void;
};

export const useFrameworkInstanceStore = create(
  persist<Store>(
    (set) => ({
      selectedInstance: null,
      name: null,
      baselineYear: null,
      setInstance(instanceId, name, baselineYear) {
        set({
          selectedInstance: instanceId,
          name: name ?? null,
          baselineYear: baselineYear ?? null,
        });
      },
    }),
    {
      version: 2,
      name: 'framework-instance-storage',
    }
  )
);
