import { create } from "zustand";
import { Book, Shelf } from "../types";
import {
  addToShelf,
  removeFromShelf,
  getBookShelf,
} from "../utils/localStorage";
import { getBookById } from "../utils/openLibrary";
import { getBookFromMemoryCache } from "../utils/bookCache";

interface BookShelfState {
  activeShelf: Shelf;
  shelfBooks: {
    read: Book[];
    currentlyReading: Book[];
    wantToRead: Book[];
  };
  isLoading: boolean;
  setActiveShelf: (shelf: Shelf) => void;
  loadUserShelves: (userId: string) => Promise<void>;
  addBookToShelf: (userId: string, bookId: string, shelf: Shelf) => void;
  removeBookFromShelf: (userId: string, bookId: string, shelf: Shelf) => void;
  getBookCurrentShelf: (userId: string, bookId: string) => Shelf | null;
}

export const useBookShelfStore = create<BookShelfState>((set, get) => ({
  activeShelf: "read",
  shelfBooks: {
    read: [],
    currentlyReading: [],
    wantToRead: [],
  },
  isLoading: false,

  setActiveShelf: (shelf) => set({ activeShelf: shelf }),

  loadUserShelves: async (userId) => {
    set({ isLoading: true });

    try {
      const user = JSON.parse(
        localStorage.getItem("bookReview_users") || "[]"
      ).find((u: any) => u.id === userId);

      if (!user) {
        set({
          shelfBooks: { read: [], currentlyReading: [], wantToRead: [] },
          isLoading: false,
        });
        return;
      }

      const shelfBooks: { [key in Shelf]: Book[] } = {
        read: [],
        currentlyReading: [],
        wantToRead: [],
      };

      // Load books for each shelf
      for (const shelf of [
        "read",
        "currentlyReading",
        "wantToRead",
      ] as Shelf[]) {
        const bookIds = user.shelves[shelf];
        const books: Book[] = [];

        for (const bookId of bookIds) {
          // First check the cache
          let book = getBookFromMemoryCache(bookId);

          // If not in cache, fetch from API
          if (!book) {
            book = await getBookById(bookId);
          }

          if (book) {
            books.push(book);
          }
        }

        shelfBooks[shelf] = books;
      }

      set({ shelfBooks, isLoading: false });
    } catch (error) {
      console.error("Error loading user shelves:", error);
      set({ isLoading: false });
    }
  },

  addBookToShelf: (userId, bookId, shelf) => {
    addToShelf(userId, bookId, shelf);

    // Refresh shelves after change
    get().loadUserShelves(userId);
  },

  removeBookFromShelf: (userId, bookId, shelf) => {
    removeFromShelf(userId, bookId, shelf);

    // Refresh shelves after change
    get().loadUserShelves(userId);
  },

  getBookCurrentShelf: (userId, bookId) => {
    return getBookShelf(userId, bookId);
  },
}));
