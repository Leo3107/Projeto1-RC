import React from "react";
import { Book, Shelf } from "@/lib/types";
import BookCard from "./BookCard";
import { BookCardSkeleton } from "../ui/Skeleton";
import { addToShelf } from "@/lib/utils/localStorage";
import { useUserStore } from "@/lib/store/userStore";

interface BookGridProps {
  books: Book[];
  onBookClick?: (book: Book) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function BookGrid({
  books,
  onBookClick,
  isLoading = false,
  emptyMessage = "No books found. Try another search.",
}: BookGridProps) {
  const { activeUser } = useUserStore();

  // Handler for adding a book to a shelf
  const handleAddToShelf = (book: Book, shelf: Shelf) => {
    if (activeUser) {
      addToShelf(activeUser.id, book.id, shelf);
      // Force a re-render to update the UI
      useUserStore.setState({});
    }
  };

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-full">
            <BookCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  // If no books, show empty message
  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  // Otherwise, render the book grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((book) => (
        <div key={book.id} className="h-full">
          <BookCard
            book={book}
            onClick={onBookClick ? () => onBookClick(book) : undefined}
            onAddToShelf={(shelf) => handleAddToShelf(book, shelf)}
          />
        </div>
      ))}
    </div>
  );
}
