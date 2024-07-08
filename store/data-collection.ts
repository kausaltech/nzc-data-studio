import { create } from 'zustand';

type Store = {
  selectedTab: 0 | 1;
  selectedAccordions: { data: number | null; assumptions: number | null };
  setTab: (tab: number) => void;
  setAccordion: (tab: 'data' | 'assumptions', accordion: number | null) => void;
};

export const useDataCollectionStore = create<Store>((set) => ({
  selectedTab: 0,
  selectedAccordions: { data: 0, assumptions: 0 },
  setTab: (tab) => (tab === 0 || tab === 1 ? set({ selectedTab: tab }) : null),
  setAccordion: (tab, accordion) =>
    set((state) => ({
      selectedAccordions: { ...state.selectedAccordions, [tab]: accordion },
    })),
}));
