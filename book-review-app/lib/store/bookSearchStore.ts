import { create } from "zustand";
import { Book } from "../types";
import { searchBooks } from "../utils/openLibrary";

interface BookSearchState {
  searchQuery: string;
  books: Book[];
  isLoading: boolean;
  error: string | null;
  filters: {
    genre?: string;
    year?: number;
  };
  setSearchQuery: (query: string) => void;
  setBooks: (books: Book[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: { genre?: string; year?: number }) => void;
  searchBooksAsync: (query: string) => Promise<void>;
}

export const useBookSearchStore = create<BookSearchState>((set, get) => ({
  searchQuery: "",
  books: [],
  isLoading: false,
  error: null,
  filters: {},
  setSearchQuery: (query) => set({ searchQuery: query }),
  setBooks: (books) => set({ books }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  searchBooksAsync: async (query) => {
    const { filters } = get();

    set({ isLoading: true, error: null });

    try {
      const books = await searchBooks(query, filters);
      set({ books, isLoading: false });
    } catch (error) {
      set({ error: "Failed to search books", isLoading: false });
    }
  },
}));
