"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/lib/types";
import { useUserStore } from "@/lib/store/userStore";
import { useBookSearchStore } from "@/lib/store/bookSearchStore";
import { useUIStore } from "@/lib/store/uiStore";
import AppLayout from "@/components/ui/AppLayout";
import SearchBar from "@/components/book/SearchBar";
import BookGrid from "@/components/book/BookGrid";
import Modal from "@/components/ui/Modal";
import BookDetail from "@/components/book/BookDetail";

export default function Home() {
  const router = useRouter();
  const { activeUser } = useUserStore();
  const { books, isLoading, searchBooksAsync } = useBookSearchStore();
  const { selectedBook, isBookModalOpen, openBookModal, closeBookModal } =
    useUIStore();

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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Discover Books
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search for books to add to your shelves and leave reviews.
          </p>
        </div>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <BookGrid
          books={books}
          onBookClick={handleBookClick}
          isLoading={isLoading}
          emptyMessage="Search for books to get started"
        />
      </div>

      {/* Book Detail Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={closeBookModal}
        title="Book Details"
        size="xl"
      >
        {selectedBook && <BookDetail book={selectedBook} />}
      </Modal>
    </AppLayout>
  );
}
