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
}

export const useSessionStore = create<SessionState>((set) => ({
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
}));
