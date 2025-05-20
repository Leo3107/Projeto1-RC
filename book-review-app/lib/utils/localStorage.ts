import { User, Book, Review, Shelf } from "../types";
import { initializeWithSampleData } from "./sampleData";

const USERS_KEY = "bookReview_users";
const REVIEWS_KEY = "bookReview_reviews";
const CACHED_BOOKS_KEY = "bookReview_cachedBooks";
const INITIALIZED_KEY = "bookReview_initialized";

// User Utilities
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return [];

  const storedUsers = localStorage.getItem(USERS_KEY);
  return storedUsers ? JSON.parse(storedUsers) : [];
};

export const saveUsers = (users: User[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUserById = (userId: string): User | undefined => {
  const users = getUsers();
  return users.find((user) => user.id === userId);
};

export const createUser = (user: Omit<User, "id" | "shelves">): User => {
  const users = getUsers();
  const newUser: User = {
    id: Date.now().toString(),
    name: user.name,
    avatar: user.avatar,
    bio: user.bio || "",
    shelves: {
      read: [],
      currentlyReading: [],
      wantToRead: [],
    },
  };

  saveUsers([...users, newUser]);
  return newUser;
};

// Shelf Utilities
export const addToShelf = (
  userId: string,
  bookId: string,
  shelf: Shelf
): void => {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) return;

  const user = users[userIndex];

  // Remove from all shelves first
  user.shelves.read = user.shelves.read.filter((id) => id !== bookId);
  user.shelves.currentlyReading = user.shelves.currentlyReading.filter(
    (id) => id !== bookId
  );
  user.shelves.wantToRead = user.shelves.wantToRead.filter(
    (id) => id !== bookId
  );

  // Add to the specified shelf
  user.shelves[shelf].push(bookId);

  users[userIndex] = user;
  saveUsers(users);
};

export const removeFromShelf = (
  userId: string,
  bookId: string,
  shelf: Shelf
): void => {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) return;

  const user = users[userIndex];
  user.shelves[shelf] = user.shelves[shelf].filter((id) => id !== bookId);

  users[userIndex] = user;
  saveUsers(users);
};

export const getBookShelf = (userId: string, bookId: string): Shelf | null => {
  const user = getUserById(userId);
  if (!user) return null;

  if (user.shelves.read.includes(bookId)) return "read";
  if (user.shelves.currentlyReading.includes(bookId)) return "currentlyReading";
  if (user.shelves.wantToRead.includes(bookId)) return "wantToRead";

  return null;
};

// Review Utilities
export const getReviews = (): Review[] => {
  if (typeof window === "undefined") return [];

  const storedReviews = localStorage.getItem(REVIEWS_KEY);
  return storedReviews ? JSON.parse(storedReviews) : [];
};

export const saveReviews = (reviews: Review[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
};

export const getReviewsByBookId = (bookId: string): Review[] => {
  const reviews = getReviews();
  return reviews.filter((review) => review.bookId === bookId);
};

export const getReviewByUserAndBookId = (
  userId: string,
  bookId: string
): Review | undefined => {
  const reviews = getReviews();
  return reviews.find(
    (review) => review.userId === userId && review.bookId === bookId
  );
};

export const createOrUpdateReview = (
  review: Omit<Review, "id" | "timestamp">
): Review => {
  const reviews = getReviews();
  const existingIndex = reviews.findIndex(
    (r) => r.userId === review.userId && r.bookId === review.bookId
  );

  if (existingIndex !== -1) {
    // Update existing review
    const updatedReview: Review = {
      ...reviews[existingIndex],
      ...review,
      timestamp: new Date(),
    };

    reviews[existingIndex] = updatedReview;
    saveReviews(reviews);
    return updatedReview;
  } else {
    // Create new review
    const newReview: Review = {
      id: Date.now().toString(),
      ...review,
      timestamp: new Date(),
    };

    saveReviews([...reviews, newReview]);
    return newReview;
  }
};

export const deleteReview = (reviewId: string): void => {
  const reviews = getReviews();
  const filteredReviews = reviews.filter((review) => review.id !== reviewId);
  saveReviews(filteredReviews);
};

// Cached Books Utilities
export const getCachedBooks = (): Book[] => {
  if (typeof window === "undefined") return [];

  const storedBooks = localStorage.getItem(CACHED_BOOKS_KEY);
  return storedBooks ? JSON.parse(storedBooks) : [];
};

export const saveBookToCache = (book: Book): void => {
  if (typeof window === "undefined") return;

  const cachedBooks = getCachedBooks();
  const existingBookIndex = cachedBooks.findIndex((b) => b.id === book.id);

  if (existingBookIndex >= 0) {
    cachedBooks[existingBookIndex] = book;
  } else {
    cachedBooks.push(book);
  }

  localStorage.setItem(CACHED_BOOKS_KEY, JSON.stringify(cachedBooks));
};

export const getBookFromCache = (bookId: string): Book | undefined => {
  const cachedBooks = getCachedBooks();
  return cachedBooks.find((book) => book.id === bookId);
};

// Initialization Utility
export const initializeAppData = (): boolean => {
  if (typeof window === "undefined") return false;

  const isInitialized = localStorage.getItem(INITIALIZED_KEY) === "true";

  if (!isInitialized) {
    // Initialize with sample data
    const initialized = initializeWithSampleData();
    if (initialized) {
      localStorage.setItem(INITIALIZED_KEY, "true");
      return true;
    }
  }

  return false;
};
