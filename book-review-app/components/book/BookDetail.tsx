import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Book, Review, Shelf } from "@/lib/types";
import { useUserStore } from "@/lib/store/userStore";
import { useBookShelfStore } from "@/lib/store/bookShelfStore";
import { getReviewsByBookId } from "@/lib/utils/localStorage";
import Badge, { formatShelfName, getShelfBadgeVariant } from "../ui/Badge";
import Button from "../ui/Button";
import ReviewList from "../review/ReviewList";

const DEFAULT_COVER = "/images/book-placeholder.svg";

interface BookDetailProps {
  book: Book;
}

export default function BookDetail({ book }: BookDetailProps) {
  const { activeUser } = useUserStore();
  const { addBookToShelf, getBookCurrentShelf, loadUserShelves } =
    useBookShelfStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");

  const currentShelf = activeUser
    ? getBookCurrentShelf(activeUser.id, book.id)
    : null;

  useEffect(() => {
    // Load reviews for this book
    const bookReviews = getReviewsByBookId(book.id);
    setReviews(bookReviews);
  }, [book.id]);

  const handleAddToShelf = (shelf: Shelf) => {
    if (activeUser) {
      addBookToShelf(activeUser.id, book.id, shelf);
      // Reload shelf data
      loadUserShelves(activeUser.id);
    }
  };

  const handleReviewChange = () => {
    // Reload reviews after a change
    const bookReviews = getReviewsByBookId(book.id);
    setReviews(bookReviews);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Book cover */}
        <div className="w-full md:w-1/3">
          <div className="relative aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={`Cover for ${book.title}`}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_COVER;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500 text-sm">
                  No cover available
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Book details */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {book.title}
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {book.author && book.author.length > 0
              ? book.author.join(", ")
              : "Unknown Author"}
            {book.year ? ` (${book.year})` : ""}
          </p>

          {currentShelf && (
            <Badge
              variant={getShelfBadgeVariant(currentShelf)}
              className="mb-4"
            >
              {formatShelfName(currentShelf)}
            </Badge>
          )}

          {activeUser && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add to your shelf:
              </p>
              <div className="flex space-x-2">
                <Button
                  variant={currentShelf === "read" ? "primary" : "secondary"}
                  onClick={() => handleAddToShelf("read")}
                >
                  Read
                </Button>
                <Button
                  variant={
                    currentShelf === "currentlyReading"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => handleAddToShelf("currentlyReading")}
                >
                  Currently Reading
                </Button>
                <Button
                  variant={
                    currentShelf === "wantToRead" ? "primary" : "secondary"
                  }
                  onClick={() => handleAddToShelf("wantToRead")}
                >
                  Want to Read
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === "reviews"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="py-4">
          {activeTab === "details" && (
            <div>
              {book.genres && book.genres.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {book.genres.map((genre, index) => (
                      <Badge key={index} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  About this Book
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {/* This is where a description would go if available in the API */}
                  This book is available on OpenLibrary with ID: {book.id}
                </p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <ReviewList
              bookId={book.id}
              reviews={reviews}
              onReviewChange={handleReviewChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
