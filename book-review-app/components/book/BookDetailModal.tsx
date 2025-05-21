import React from "react";
import { Book } from "@/lib/types";
import { useUIStore } from "@/lib/store/uiStore";
import Modal from "../ui/Modal";
import BookDetail from "./BookDetail";

interface BookDetailModalProps {
  // This component doesn't need any props as it uses the global UI store
}

/**
 * A reusable modal component for displaying book details.
 * Uses the global UI store to manage state and can be used anywhere in the application.
 */
export default function BookDetailModal({}: BookDetailModalProps) {
  const { selectedBook, isBookModalOpen, closeBookModal } = useUIStore();

  return (
    <Modal
      isOpen={isBookModalOpen}
      onClose={closeBookModal}
      title="Book Details"
      size="xl"
    >
      {selectedBook && <BookDetail book={selectedBook} />}
    </Modal>
  );
}

/**
 * Helper hook for using the BookDetailModal functionality in any component
 * @returns Functions to open book modals
 */
export function useBookModal() {
  const { openBookModal, closeBookModal } = useUIStore();

  const handleBookClick = (book: Book) => {
    openBookModal(book);
  };

  return {
    openBookModal: handleBookClick,
    closeBookModal,
  };
}
