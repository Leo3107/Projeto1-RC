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
  setDarkMode: (isDark: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  selectedBook: null,
  isBookModalOpen: false,
  toggleDarkMode: () =>
    set((state) => {
      const newIsDarkMode = !state.isDarkMode;
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", newIsDarkMode.toString());
        if (newIsDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        document.cookie = `darkMode=${newIsDarkMode.toString()}; path=/; max-age=31536000`;
      }
      return { isDarkMode: newIsDarkMode };
    }),
  setSelectedBook: (book) => set({ selectedBook: book }),
  openBookModal: (book) => set({ selectedBook: book, isBookModalOpen: true }),
  closeBookModal: () => set({ isBookModalOpen: false }),
  setDarkMode: (isDark) =>
    set(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", isDark.toString());
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        document.cookie = `darkMode=${isDark.toString()}; path=/; max-age=31536000`;
      }
      return { isDarkMode: isDark };
    }),
}));

export const initializeUIStore = () => {
  if (typeof window !== "undefined") {
    const savedDarkModeString = localStorage.getItem("darkMode");
    let isInitiallyDark = false;

    if (savedDarkModeString !== null) {
      isInitiallyDark = savedDarkModeString === "true";
    } else {
      isInitiallyDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      localStorage.setItem("darkMode", isInitiallyDark.toString());
    }

    useUIStore.getState().setDarkMode(isInitiallyDark);

    if (document.cookie.indexOf("darkMode=") === -1) {
      document.cookie = `darkMode=${isInitiallyDark.toString()}; path=/; max-age=31536000`;
    }
  }
};
