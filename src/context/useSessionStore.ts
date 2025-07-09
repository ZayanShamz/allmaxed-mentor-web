import { create } from "zustand";

interface SessionState {
  selectedSkill: string;
  setSelectedSkill: (skill: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  cardId: string | null;
  setCardId: (id: string | null) => void;
  isInitialized: boolean;
  setInitialized: (initialized: boolean) => void;
  selectCardAndNavigate: (id: string | null, basePath: string) => string;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  selectedSkill: "skill1",
  setSelectedSkill: (skill: string) => set({ selectedSkill: skill }),
  selectedCategory: "allmaxed",
  setSelectedCategory: (category: string) =>
    set({ selectedCategory: category }),
  currentPage: 1,
  setCurrentPage: (page: number) => set({ currentPage: page }),
  cardId: null,
  setCardId: (id: string | null) => set({ cardId: id }),
  isInitialized: false,
  setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),
  selectCardAndNavigate: (id: string | null, basePath: string) => {
    set({ cardId: id });
    const { selectedCategory, currentPage } = get();
    console.log("selectCardAndNavigate in store: ", {
      id,
      selectedCategory,
      currentPage,
      basePath,
    });
    const params = new URLSearchParams();
    params.set("category", selectedCategory);
    params.set("page", currentPage.toString());
    if (id) params.set("cardId", id);
    const url = `${basePath}?${params.toString()}`;
    console.log("Generated URL in store:", url);
    return url;
  },
}));
