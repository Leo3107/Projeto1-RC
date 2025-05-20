"use client";

import { useEffect, useState } from "react";
import { Book } from "@/lib/types";
import { getBookById } from "@/lib/utils/openLibrary";
import { getBookFromMemoryCache } from "@/lib/utils/bookCache";
import AppLayout from "@/components/ui/AppLayout";
import BookDetail from "@/components/book/BookDetail";
import Skeleton from "@/components/ui/Skeleton";

export default function BookPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);

        // Decode the ID from the URL (in case it's encoded)
        const decodedId = decodeURIComponent(params.id);

        // Format the ID to match OpenLibrary's format if needed
        const formattedId = decodedId.startsWith("/")
          ? decodedId
          : `/${decodedId}`;

        // Check cache first
        const cachedBook = getBookFromMemoryCache(formattedId);
        if (cachedBook) {
          setBook(cachedBook);
          setLoading(false);
          return;
        }

        // If not in cache, fetch from API
        const bookData = await getBookById(formattedId);
        setBook(bookData);
      } catch (err) {
        console.error("Error fetching book:", err);
        setError("Failed to load the book. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params.id]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="space-y-4">
            <Skeleton height="h-10" width="w-1/2" />
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton width="w-full md:w-1/3" height="h-96" />
              <div className="flex-1 space-y-4">
                <Skeleton height="h-6" width="w-3/4" />
                <Skeleton height="h-4" width="w-1/2" />
                <Skeleton height="h-20" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Error</h2>
            <p>{error}</p>
          </div>
        ) : book ? (
          <BookDetail book={book} />
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Book Not Found</h2>
            <p>We couldn't find the book you're looking for.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
