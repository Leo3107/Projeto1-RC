import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react"; // Import useSession
import { Book, Shelf } from "@/lib/types";
import { useBookShelfStore } from "@/lib/store/bookShelfStore";
import Card from "../ui/Card";
import Badge, { formatShelfName, getShelfBadgeVariant } from "../ui/Badge";
import Button from "../ui/Button";

const DEFAULT_COVER = "/images/book-placeholder.svg";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  // onAddToShelf prop is removed as the component will use the store directly
  showShelfControls?: boolean;
}

export default function BookCard({
  book,
  onClick,
  showShelfControls = true,
}: BookCardProps) {
  const { data: session } = useSession();
  const {
    addBookToShelf,
    removeBookFromShelf,
    getBookCurrentShelf,
    isLoading: isShelfLoading, // Use a different name to avoid conflict if page has its own isLoading
  } = useBookShelfStore();

  // currentShelf now only depends on the bookId, as the store is user-aware
  const currentShelf = getBookCurrentShelf(book.id);

  const publishYear = book.year ? `(${book.year})` : "";
  const authorText =
    book.author && book.author.length > 0
      ? book.author.join(", ")
      : "Unknown Author";

  const handleShelfAction = async (shelf: Shelf, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session?.user?.id) {
      // Optionally, redirect to login or show a message
      console.warn("User not authenticated to perform shelf action.");
      return;
    }

    if (currentShelf === shelf) {
      // Already on this shelf, so remove it
      await removeBookFromShelf(session.user.id, book.id);
    } else {
      // Add to the new shelf (or move from another)
      await addBookToShelf(
        session.user.id,
        book.id,
        shelf,
        book.title,
        book.author.join(", "), // Pass author as string
        book.coverUrl
      );
    }
  };

  return (
    <Card hoverable onClick={onClick} className="h-full flex flex-col">
      <div className="relative h-56 bg-gray-200 dark:bg-gray-700">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={`Cover for ${book.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={(e) => {
              // Fallback to default cover on error
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

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-gray-100">
          {book.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {authorText} {publishYear}
        </p>

        {currentShelf && (
          <Badge
            variant={getShelfBadgeVariant(currentShelf)}
            className="mb-3 self-start"
          >
            {formatShelfName(currentShelf)}
          </Badge>
        )}

        {showShelfControls && session?.user && (
          <div className="mt-auto grid grid-cols-3 gap-1">
            {(["read", "currentlyReading", "wantToRead"] as Shelf[]).map(
              (shelfOption) => (
                <Button
                  key={shelfOption}
                  size="sm"
                  variant={currentShelf === shelfOption ? "primary" : "ghost"}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleShelfAction(shelfOption, e)
                  }
                  className="text-xs"
                  disabled={isShelfLoading} // Disable button while shelf action is in progress
                >
                  {shelfOption === "read" && "Read"}
                  {shelfOption === "currentlyReading" && "Reading"}
                  {shelfOption === "wantToRead" && "Want"}
                </Button>
              )
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
