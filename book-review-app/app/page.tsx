"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/lib/types";
import { useUserStore } from "@/lib/store/userStore";
import { useBookSearchStore } from "@/lib/store/bookSearchStore";
import AppLayout from "@/components/ui/AppLayout";
import SearchBar from "@/components/book/SearchBar";
import BookGrid from "@/components/book/BookGrid";
import BookDetailModal, {
  useBookModal,
} from "@/components/book/BookDetailModal";

export default function Home() {
  const router = useRouter();
  const { activeUser } = useUserStore();
  const { books, isLoading, searchBooksAsync } = useBookSearchStore();
  const { openBookModal } = useBookModal();

  // If no active user, redirect to user selection page
  useEffect(() => {
    if (!activeUser) {
      router.push("/users");
    }
  }, [activeUser, router]);

  const handleSearch = (
    query: string,
    filters: { genre?: string; year?: number }
  ) => {
    searchBooksAsync(query);
  };

  const handleBookClick = (book: Book) => {
    openBookModal(book);
  };

  return (
    <AppLayout>
      <div className="w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Discover Books
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search for books to add to your shelves and leave reviews.
          </p>
        </div>
        <SearchBar onSearch={handleSearch} />
        <div className="mt-8">
          <BookGrid
            books={books}
            onBookClick={handleBookClick}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Include the modularized book detail modal */}
      <BookDetailModal />
    </AppLayout>
  );
}
