import { Book } from "../types";
import { getCachedBooks, saveBookToCache } from "./localStorage";

// In-memory cache for books to reduce localStorage operations
const memoryCache: Record<string, Book> = {};

// Load books from localStorage into memory cache on initialization
export const initializeBookCache = (): void => {
  const books = getCachedBooks();
  books.forEach((book) => {
    memoryCache[book.id] = book;
  });
};

// Get a book from cache (memory first, then localStorage)
export const getBookFromMemoryCache = (id: string): Book | undefined => {
  // Check memory cache first
  if (memoryCache[id]) {
    return memoryCache[id];
  }

  // Check localStorage if not in memory
  const book = getCachedBooks().find((book) => book.id === id);
  if (book) {
    // Update memory cache for future use
    memoryCache[id] = book;
  }

  return book;
};

// Save a book to both memory cache and localStorage
export const saveBookToMemoryCache = (book: Book): void => {
  memoryCache[book.id] = book;
  saveBookToCache(book);
};

// Batch save books to both memory cache and localStorage
export const batchSaveBooks = (books: Book[]): void => {
  books.forEach((book) => {
    memoryCache[book.id] = book;
  });

  // Update localStorage in a single operation
  const cachedBooks = getCachedBooks();
  const bookMap = new Map(cachedBooks.map((book) => [book.id, book]));

  books.forEach((book) => {
    bookMap.set(book.id, book);
  });

  localStorage.setItem(
    "bookReview_cachedBooks",
    JSON.stringify(Array.from(bookMap.values()))
  );
};

// Clear the entire book cache (both memory and localStorage)
export const clearBookCache = (): void => {
  localStorage.removeItem("bookReview_cachedBooks");
  Object.keys(memoryCache).forEach((key) => {
    delete memoryCache[key];
  });
};
