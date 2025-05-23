import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react"; // Import useSession
import { Book, Review, Shelf } from "@/lib/types";
import { useBookShelfStore } from "@/lib/store/bookShelfStore";
import Badge, { formatShelfName, getShelfBadgeVariant } from "../ui/Badge";
import Button from "../ui/Button";
import ReviewList from "../review/ReviewList";
import ReviewForm from "../review/ReviewForm"; // Import ReviewForm

const DEFAULT_COVER = "/images/book-placeholder.svg";

interface BookDetailProps {
  book: Book;
}

export default function BookDetail({ book }: BookDetailProps) {
  const { data: session } = useSession(); // Use NextAuth session
  const {
    addBookToShelf,
    removeBookFromShelf,
    getBookCurrentShelf,
    isLoading: isShelfLoading, // isLoading from bookShelfStore
  } = useBookShelfStore();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const [showReviewForm, setShowReviewForm] = useState(false); // State to control ReviewForm visibility

  const currentShelf = getBookCurrentShelf(book.id);

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    setReviewsError(null);
    try {
      const response = await fetch(`/api/reviews?bookId=${book.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch reviews");
      }
      const data: Review[] = await response.json();
      setReviews(data);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      setReviewsError(error.message || "An unknown error occurred");
    }
    setIsLoadingReviews(false);
  };

  useEffect(() => {
    if (book.id) {
      fetchReviews();
    }
  }, [book.id]);

  const handleShelfAction = async (shelf: Shelf) => {
    if (!session?.user?.id) {
      console.warn("User not authenticated to perform shelf action.");
      return;
    }

    if (currentShelf === shelf) {
      await removeBookFromShelf(session.user.id, book.id);
    } else {
      await addBookToShelf(
        session.user.id,
        book.id,
        shelf,
        book.title,
        book.author.join(", "),
        book.coverUrl
      );
    }
  };

  const handleReviewChange = () => {
    fetchReviews();
    setShowReviewForm(false); // Hide form after submission/cancellation
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

          {session?.user && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Update shelf:
              </p>
              <div className="flex flex-wrap gap-2">
                {(["read", "currentlyReading", "wantToRead"] as Shelf[]).map(
                  (shelfOption) => (
                    <Button
                      key={shelfOption}
                      variant={
                        currentShelf === shelfOption ? "primary" : "secondary"
                      }
                      onClick={() => handleShelfAction(shelfOption)}
                      disabled={isShelfLoading}
                      size="sm"
                    >
                      {shelfOption === "read" && "Read"}
                      {shelfOption === "currentlyReading" && "Reading"}
                      {shelfOption === "wantToRead" && "Want to Read"}
                    </Button>
                  )
                )}
                {currentShelf && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (session?.user?.id && currentShelf) {
                        removeBookFromShelf(session.user.id, book.id);
                      }
                    }}
                    disabled={isShelfLoading}
                    size="sm"
                    className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                  >
                    Remove from Shelf
                  </Button>
                )}
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
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {book.description || "No description available."}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  ISBN
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {book.isbn || "Not available"}
                </p>
              </div>
              {/* Add more details as needed */}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {session?.user && !showReviewForm && (
                <div className="flex justify-end">
                  <Button onClick={() => setShowReviewForm(true)}>
                    Write a Review
                  </Button>
                </div>
              )}
              {showReviewForm && session?.user?.id && (
                <ReviewForm
                  bookId={book.id}
                  userId={session.user.id} // Pass userId from session
                  onSubmitSuccess={handleReviewChange}
                  onCancel={() => setShowReviewForm(false)}
                />
              )}
              {isLoadingReviews && <p>Loading reviews...</p>}
              {reviewsError && (
                <div className="my-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
                  <p className="font-semibold">Error loading reviews:</p>
                  <p>{reviewsError}</p>
                  <Button onClick={fetchReviews} className="mt-2">
                    Try Again
                  </Button>
                </div>
              )}
              {!isLoadingReviews && !reviewsError && (
                <ReviewList
                  bookId={book.id}
                  reviews={reviews}
                  onReviewChange={handleReviewChange} // Pass the callback
                  currentUserId={session?.user?.id} // Pass currentUserId
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
