import { create } from "zustand";

const ALL_MEMBER_IDS = ["sunwoo", "chanwoo", "jaeho", "sooyoung"];
const ALL_CATEGORY_IDS = ["school", "academy", "talent", "english", "sports", "family", "dinner", "conference", "class", "etc"];

interface FilterStore {
  selectedMemberIds: string[];
  selectedCategoryIds: string[];
  toggleMember: (id: string) => void;
  toggleCategory: (id: string) => void;
  setSelectedMemberIds: (ids: string[]) => void;
  setSelectedCategoryIds: (ids: string[]) => void;
  selectAllMembers: () => void;
  selectAllCategories: () => void;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  selectedMemberIds: [...ALL_MEMBER_IDS],
  selectedCategoryIds: [...ALL_CATEGORY_IDS],

  toggleMember: (id) => {
    const { selectedMemberIds } = get();
    if (selectedMemberIds.includes(id)) {
      set({ selectedMemberIds: selectedMemberIds.filter((m) => m !== id) });
    } else {
      set({ selectedMemberIds: [...selectedMemberIds, id] });
    }
  },

  toggleCategory: (id) => {
    const { selectedCategoryIds } = get();
    if (selectedCategoryIds.includes(id)) {
      set({ selectedCategoryIds: selectedCategoryIds.filter((c) => c !== id) });
    } else {
      set({ selectedCategoryIds: [...selectedCategoryIds, id] });
    }
  },

  setSelectedMemberIds: (ids) => set({ selectedMemberIds: ids }),
  setSelectedCategoryIds: (ids) => set({ selectedCategoryIds: ids }),
  selectAllMembers: () => set({ selectedMemberIds: [...ALL_MEMBER_IDS] }),
  selectAllCategories: () => set({ selectedCategoryIds: [...ALL_CATEGORY_IDS] }),
}));
