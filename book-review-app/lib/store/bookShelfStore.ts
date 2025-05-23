import { create } from "zustand";
import { Book, Shelf, UserBookShelfEntry } from "../types";

interface BookShelfState {
  activeShelf: Shelf;
  shelfBooks: {
    read: Book[];
    currentlyReading: Book[];
    wantToRead: Book[];
  };
  isLoading: boolean;
  error: string | null;
  setActiveShelf: (shelf: Shelf) => void;
  loadUserShelves: (userId: string) => Promise<void>;
  addBookToShelf: (
    userId: string,
    bookId: string,
    shelf: Shelf,
    title?: string,
    author?: string, // Changed to string to match Book type if simplified, or string[] if not
    coverImage?: string
  ) => Promise<void>;
  removeBookFromShelf: (userId: string, bookId: string) => Promise<void>;
  getBookCurrentShelf: (bookId: string) => Shelf | null;
}

export const useBookShelfStore = create<BookShelfState>((set, get) => ({
  activeShelf: "read",
  shelfBooks: {
    read: [],
    currentlyReading: [],
    wantToRead: [],
  },
  isLoading: false,
  error: null,

  setActiveShelf: (shelf) => set({ activeShelf: shelf, error: null }),

  loadUserShelves: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/bookshelf?userId=${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to load bookshelves");
      }
      const userShelves: UserBookShelfEntry[] = await response.json();

      const newShelfBooks: BookShelfState["shelfBooks"] = {
        read: [],
        currentlyReading: [],
        wantToRead: [],
      };

      for (const item of userShelves) {
        const book: Book = {
          id: item.bookId,
          title: item.bookTitle || "Unknown Title",
          author: item.bookAuthor ? [item.bookAuthor] : ["Unknown Author"], // Ensure author is string[]
          coverUrl: item.bookCover || undefined, // Corrected to coverUrl from Book type
          // year and genres are optional and might not be present here
        };
        // Ensure item.shelf is a valid Shelf key
        if (
          item.shelf === "read" ||
          item.shelf === "currentlyReading" ||
          item.shelf === "wantToRead"
        ) {
          newShelfBooks[item.shelf].push(book);
        } else {
          console.warn(`Invalid shelf type received from API: ${item.shelf}`);
        }
      }
      set({ shelfBooks: newShelfBooks, isLoading: false });
    } catch (error) {
      console.error("Error loading user shelves:", error);
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      set({ isLoading: false, error: message });
    }
  },

  addBookToShelf: async (userId, bookId, shelf, title, author, coverImage) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/bookshelf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          bookId,
          shelf,
          title,
          author,
          coverImage,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add book to shelf");
      }
      await get().loadUserShelves(userId);
    } catch (error) {
      console.error("Error adding book to shelf:", error);
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      set({ isLoading: false, error: message });
    }
  },

  removeBookFromShelf: async (userId, bookId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/bookshelf/${bookId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to remove book from shelf"
        );
      }
      await get().loadUserShelves(userId);
    } catch (error) {
      console.error("Error removing book from shelf:", error);
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      set({ isLoading: false, error: message });
    }
  },

  getBookCurrentShelf: (bookId) => {
    const { shelfBooks } = get();
    for (const shelfKey in shelfBooks) {
      const shelf = shelfKey as Shelf;
      if (shelfBooks[shelf].some((book: Book) => book.id === bookId)) {
        return shelf;
      }
    }
    return null;
  },
}));
