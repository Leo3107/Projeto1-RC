import { Book } from "@/lib/types";
import BookCard from "./BookCard";
import Link from "next/link";

interface BookSectionProps {
  title: string;
  books: Book[];
  loading?: boolean;
  onBookClick?: (bookId: string) => void;
  viewAllLink?: string;
  emptyMessage?: string;
  showShelfControls?: boolean;
}

export default function BookSection({
  title,
  books,
  loading = false,
  onBookClick,
  viewAllLink,
  emptyMessage = "No books available",
  showShelfControls = false,
}: BookSectionProps) {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
          
          {viewAllLink && (
            <Link 
              href={viewAllLink} 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              View all
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
          {loading ? (
            // Skeleton loaders
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse w-full max-w-xs">
                <div className="h-56 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))          ) : books.length > 0 ? (
            books.map(book => (
              <div className="w-full max-w-xs" key={book.id}>
                <BookCard 
                  book={book} 
                  onClick={onBookClick ? () => onBookClick(book.id) : undefined} 
                  showShelfControls={showShelfControls}
                />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              {emptyMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
