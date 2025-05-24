import { create } from 'zustand';

export type Tab = 'data' | 'assumptions';

type Store = {
  selectedTab: Tab;
  selectedAccordions: { data: number | null; assumptions: number | null };
  getSelectedAccordion: () => number | null;
  setTab: (tab: Tab) => void;
  setAccordion: (accordion: number | null) => void;
};

export const useDataCollectionStore = create<Store>((set, get) => ({
  selectedTab: 'data',
  selectedAccordions: { data: 0, assumptions: 0 },
  getSelectedAccordion: () => get().selectedAccordions[get().selectedTab],
  setTab: (tab) =>
    tab === 'data' || tab === 'assumptions' ? set({ selectedTab: tab }) : null,
  setAccordion(accordion) {
    set((state) => ({
      selectedAccordions: {
        ...state.selectedAccordions,
        [state.selectedTab]: accordion,
      },
    }));
  },
}));
