import { create } from "zustand";
import { Book } from "../types";

interface UIState {
  isDarkMode: boolean;
  selectedBook: Book | null;
  isBookModalOpen: boolean;
  toggleDarkMode: () => void;
  setSelectedBook: (book: Book | null) => void;
  openBookModal: (book: Book) => void;
  closeBookModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  selectedBook: null,
  isBookModalOpen: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setSelectedBook: (book) => set({ selectedBook: book }),
  openBookModal: (book) => set({ selectedBook: book, isBookModalOpen: true }),
  closeBookModal: () => set({ isBookModalOpen: false }),
}));

// Initialize dark mode preference from local storage
export const initializeUIStore = () => {
  if (typeof window !== "undefined") {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";

    // Use set to update the store state
    useUIStore.setState({ isDarkMode: savedDarkMode });

    // Apply dark mode class to document if needed
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
};

// Update local storage on dark mode changes
export const setupUIStoreListeners = () => {
  useUIStore.subscribe(
    (state) => state.isDarkMode,
    (isDarkMode) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", isDarkMode.toString());

        if (isDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }
  );
};
