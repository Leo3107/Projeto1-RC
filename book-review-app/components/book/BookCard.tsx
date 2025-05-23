import React from "react";
import Image from "next/image";
import { Book, Shelf } from "@/lib/types";
import { useUserStore } from "@/lib/store/userStore";
import { useBookShelfStore } from "@/lib/store/bookShelfStore";
import Card from "../ui/Card";
import Badge, { formatShelfName, getShelfBadgeVariant } from "../ui/Badge";
import Button from "../ui/Button";

const DEFAULT_COVER = "/images/book-placeholder.svg";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  onAddToShelf?: (shelf: Shelf) => void;
  showShelfControls?: boolean;
}

export default function BookCard({
  book,
  onClick,
  onAddToShelf,
  showShelfControls = true,
}: BookCardProps) {
  const { activeUser } = useUserStore();
  const { getBookCurrentShelf } = useBookShelfStore();
  const currentShelf = activeUser
    ? getBookCurrentShelf(activeUser.id, book.id)
    : null;

  // Extract year from book object
  const publishYear = book.year ? `(${book.year})` : "";

  // Format authors for display
  const authorText =
    book.author && book.author.length > 0
      ? book.author.join(", ")
      : "Unknown Author";

  const handleAddToShelf = (shelf: Shelf, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal
    if (onAddToShelf) {
      onAddToShelf(shelf);
    }
  };
  return (
    <Card hoverable onClick={onClick} className="h-full flex flex-col group">
      <div className="relative h-56 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={`Cover for ${book.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
        {/* Add a subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {book.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 mt-1">
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

        {showShelfControls && activeUser && (
          <div className="mt-auto grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            {" "}
            <Button
              size="sm"
              variant={currentShelf === "read" ? "primary" : "ghost"}
              onClick={(e) => handleAddToShelf("read", e)}
              className="text-xs transition-all duration-300 hover:scale-105"
            >
              Read
            </Button>
            <Button
              size="sm"
              variant={
                currentShelf === "currentlyReading" ? "primary" : "ghost"
              }
              onClick={(e) => handleAddToShelf("currentlyReading", e)}
              className="text-xs transition-all duration-300 hover:scale-105"
            >
              Reading
            </Button>
            <Button
              size="sm"
              variant={currentShelf === "wantToRead" ? "primary" : "ghost"}
              onClick={(e) => handleAddToShelf("wantToRead", e)}
              className="text-xs transition-all duration-300 hover:scale-105"
            >
              Want
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
