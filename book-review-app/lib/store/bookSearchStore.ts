import { create } from "zustand";
import { Book } from "../types";

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
  setFilters: (filters: { genre?: string; year?: number }) => void;
  searchBooksAsync: (query?: string) => Promise<void>;
  clearSearch: () => void;
}

export const useBookSearchStore = create<BookSearchState>((set, get) => ({
  searchQuery: "",
  books: [],
  isLoading: false,
  error: null,
  filters: {},
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set({ filters, searchQuery: "" }), 
  searchBooksAsync: async (query?: string) => {
    const currentQuery = query !== undefined ? query : get().searchQuery;
    const { filters } = get();

    if (!currentQuery && !filters.genre && !filters.year) {
      set({ books: [], isLoading: false, error: null });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const params = new URLSearchParams();
      if (currentQuery) params.append("q", currentQuery);
      if (filters.genre) params.append("genre", filters.genre);
      if (filters.year) params.append("year", filters.year.toString());

      const response = await fetch(`/api/books?${params.toString()}`);
      if (!response.ok) {
        let errorMessage = "Failed to fetch books from API";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (_error) { // Use underscore to indicate unused variable
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      const booksData: Book[] = await response.json();
      set({ books: booksData, isLoading: false });
    } catch (err: unknown) { 
      if (err instanceof Error) {
        set({ error: err.message || "Failed to search books", isLoading: false, books: [] });
      } else {
        set({ error: "An unknown error occurred", isLoading: false, books: [] });
      }
    }
  },
  clearSearch: () => set({ searchQuery: "", books: [], error: null, isLoading: false, filters: {} }),
}));
