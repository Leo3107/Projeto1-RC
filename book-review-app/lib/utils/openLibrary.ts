import { Book, OpenLibrarySearchResponse } from "../types";
import {
  getBookFromMemoryCache,
  saveBookToMemoryCache,
  batchSaveBooks,
} from "./bookCache";

const API_BASE_URL = "https://openlibrary.org";
const SEARCH_API = `${API_BASE_URL}/search.json`;

export const searchBooks = async (
  query: string,
  filters: { genre?: string; year?: number } = {}
): Promise<Book[]> => {
  if (!query) return [];

  let searchQuery = query;

  // Add filters to the query
  if (filters.genre) {
    searchQuery += ` subject:${filters.genre}`;
  }

  if (filters.year) {
    searchQuery += ` first_publish_year:${filters.year}`;
  }

  try {
    const response = await fetch(
      `${SEARCH_API}?q=${encodeURIComponent(searchQuery)}&limit=20`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const data: OpenLibrarySearchResponse = await response.json();
    const books: Book[] = data.docs.map((doc) => ({
      id: doc.key,
      title: doc.title,
      author: doc.author_name || ["Unknown"],
      year: doc.first_publish_year,
      coverUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : undefined,
    }));

    // Cache the books for future use
    batchSaveBooks(books);

    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    // First, check if the book is in the cache
    const cachedBook = getBookFromMemoryCache(id);
    if (cachedBook) {
      return cachedBook;
    }

    // Remove leading slash if present
    const bookId = id.startsWith("/") ? id.substring(1) : id;

    const response = await fetch(`${API_BASE_URL}/${bookId}.json`);

    if (!response.ok) {
      throw new Error("Failed to fetch book details");
    }
    const data = await response.json();

    // Format the book data
    const book: Book = {
      id: data.key,
      title: data.title,
      author:
        data.author_name ||
        (data.authors
          ? data.authors.map((a: { name: string }) => a.name)
          : ["Unknown"]),
      year: data.first_publish_year || data.publish_date,
      genres: data.subjects?.slice(0, 5) || [],
      coverUrl:
        data.covers && data.covers.length > 0
          ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg`
          : undefined,
    };

    // Save the book to cache
    saveBookToMemoryCache(book);

    return book;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
};
