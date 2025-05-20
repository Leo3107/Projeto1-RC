import { Book, Review, User } from "../types";

// Sample users
export const sampleUsers: User[] = [
  {
    id: "user-1",
    name: "Jane Austen",
    avatar: "/images/default-avatar.svg",
    bio: "Classic literature enthusiast and aspiring writer.",
    shelves: {
      read: ["OL24364628W", "OL31801W", "OL1536505W"],
      currentlyReading: ["OL27448W"],
      wantToRead: ["OL103123W", "OL7353617W"],
    },
  },
  {
    id: "user-2",
    name: "Mark Twain",
    avatar: "/images/default-avatar.svg",
    bio: "Adventure book lover with a passion for witty narratives.",
    shelves: {
      read: ["OL1536505W", "OL27448W"],
      currentlyReading: ["OL103123W"],
      wantToRead: ["OL24364628W", "OL7353617W"],
    },
  },
];

// Sample books with actual OpenLibrary IDs
export const sampleBooks: Book[] = [
  {
    id: "OL24364628W",
    title: "Pride and Prejudice",
    author: ["Jane Austen"],
    year: 1813,
    genres: ["Fiction", "Romance", "Classic"],
    coverUrl: "https://covers.openlibrary.org/b/id/8409250-L.jpg",
  },
  {
    id: "OL31801W",
    title: "To Kill a Mockingbird",
    author: ["Harper Lee"],
    year: 1960,
    genres: ["Fiction", "Coming-of-age", "Southern Gothic"],
    coverUrl: "https://covers.openlibrary.org/b/id/8205530-L.jpg",
  },
  {
    id: "OL1536505W",
    title: "1984",
    author: ["George Orwell"],
    year: 1949,
    genres: ["Science Fiction", "Dystopian", "Political fiction"],
    coverUrl: "https://covers.openlibrary.org/b/id/8575143-L.jpg",
  },
  {
    id: "OL27448W",
    title: "The Great Gatsby",
    author: ["F. Scott Fitzgerald"],
    year: 1925,
    genres: ["Fiction", "Novel", "Social Criticism"],
    coverUrl: "https://covers.openlibrary.org/b/id/8430456-L.jpg",
  },
  {
    id: "OL103123W",
    title: "The Lord of the Rings",
    author: ["J.R.R. Tolkien"],
    year: 1954,
    genres: ["Fantasy", "Adventure", "Epic"],
    coverUrl: "https://covers.openlibrary.org/b/id/8406786-L.jpg",
  },
  {
    id: "OL7353617W",
    title: "The Hobbit",
    author: ["J.R.R. Tolkien"],
    year: 1937,
    genres: ["Fantasy", "Children's literature", "Adventure"],
    coverUrl: "https://covers.openlibrary.org/b/id/12003830-L.jpg",
  },
];

// Sample reviews
export const sampleReviews: Review[] = [
  {
    id: "review-1",
    userId: "user-1",
    bookId: "OL24364628W",
    rating: 5,
    text: "A timeless classic that perfectly captures the social nuances of its era while delivering a captivating love story.",
    hasSpoilers: false,
    timestamp: new Date("2024-05-01"),
  },
  {
    id: "review-2",
    userId: "user-2",
    bookId: "OL1536505W",
    rating: 4,
    text: "Orwell's dystopian vision remains eerily relevant. The world-building is immaculate, though I found the middle section slightly dragging.",
    hasSpoilers: true,
    timestamp: new Date("2024-04-15"),
  },
  {
    id: "review-3",
    userId: "user-1",
    bookId: "OL31801W",
    rating: 5,
    text: "A powerful exploration of morality, innocence, and justice. Scout's narrative voice is both charming and profound.",
    hasSpoilers: false,
    timestamp: new Date("2024-03-20"),
  },
  {
    id: "review-4",
    userId: "user-2",
    bookId: "OL27448W",
    rating: 4,
    text: "Fitzgerald's prose is beautiful, and the depiction of the Jazz Age is captivating. The tragic ending still resonates.",
    hasSpoilers: true,
    timestamp: new Date("2024-02-10"),
  },
];

// Function to initialize the application with sample data
export const initializeWithSampleData = () => {
  const hasInitialized = localStorage.getItem("bookReview_initialized");

  if (!hasInitialized) {
    // Store sample users
    localStorage.setItem("bookReview_users", JSON.stringify(sampleUsers));

    // Store sample reviews
    localStorage.setItem("bookReview_reviews", JSON.stringify(sampleReviews));

    // Store sample books
    localStorage.setItem("bookReview_cachedBooks", JSON.stringify(sampleBooks));

    return true;
  }

  return false;
};
