import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = {
  selectedInstance: string | null;
  setInstance: (instanceId: string | null) => void;
};

export const useFrameworkInstanceStore = create(
  persist<Store>(
    (set) => ({
      selectedInstance: null,
      setInstance(instanceId) {
        set({ selectedInstance: instanceId });
      },
    }),
    {
      name: 'framework-instance-storage',
    }
  )
);
