// src/types/global.d.ts
interface Navigation {
  currentEntry: NavigationHistoryEntry | null;
  transition: NavigationTransition | null;
}

interface NavigationState {
  type: "reload" | "push" | "replace" | "traverse"; // Define the possible types
  // Add other properties if needed
}

interface NavigationHistoryEntry {
  getState(): NavigationState | null; // Specific type instead of generic
  key: string;
  url: string;
  id: number;
}

interface NavigationTransition {
  from: NavigationHistoryEntry | null;
  to: NavigationHistoryEntry | null;
  type: "reload" | "push" | "replace" | "traverse";
}
