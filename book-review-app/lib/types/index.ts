// Data Models
export interface User {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  shelves: {
    read: string[];
    currentlyReading: string[];
    wantToRead: string[];
  };
}

export interface Book {
  id: string; // OpenLibrary key (e.g., "/works/OL123W")
  title: string;
  author: string[];
  year?: number;
  genres?: string[];
  coverUrl?: string;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  text: string;
  hasSpoilers: boolean;
  timestamp: Date;
}

// API Response Types
export interface OpenLibrarySearchResponse {
  docs: Array<{
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
  }>;
}

// Shelf Type
export type Shelf = "read" | "currentlyReading" | "wantToRead";

// Represents an item on a user's bookshelf, typically returned by the API
export interface UserBookShelfEntry {
  id: string; // ID of the UserBookShelf record
  userId: string;
  bookId: string; // OpenLibrary key
  shelf: Shelf;
  addedAt: string; // ISO date string
  updatedAt: string; // ISO date string
  bookTitle?: string | null;
  bookAuthor?: string | null; // Typically a single string (e.g., primary author)
  bookCover?: string | null; // URL for the cover image
}
