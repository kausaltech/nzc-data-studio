import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = {
  selectedInstance: string | null;
  name: string | null;
  baselineYear: number | null;
  targetYear: number | null;
  setInstance: (
    instanceId: string | null,
    name?: string,
    baselineYear?: number,
    targetYear?: number
  ) => void;
};

export const useFrameworkInstanceStore = create(
  persist<Store>(
    (set) => ({
      selectedInstance: null,
      name: null,
      baselineYear: null,
      targetYear: null,
      setInstance(instanceId, name, baselineYear, targetYear) {
        set({
          selectedInstance: instanceId,
          name: name ?? null,
          baselineYear: baselineYear ?? null,
          targetYear: targetYear ?? null,
        });
      },
    }),
    {
      version: 2,
      name: 'framework-instance-storage',
    }
  )
);
