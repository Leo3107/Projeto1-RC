"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { useBookShelfStore } from "@/lib/store/bookShelfStore";
import AppLayout from "@/components/ui/AppLayout";
import BookGrid from "@/components/book/BookGrid";
import ProfileCard from "@/components/ui/ProfileCard";
import { Shelf } from "@/lib/types";
import { saveUsers } from "@/lib/utils/localStorage";
import { Badge } from "@/components/ui/Badge";

export default function MyBooksPage() {
  const router = useRouter();
  const { activeUser } = useUserStore();
  const {
    activeShelf,
    shelfBooks,
    isLoading,
    setActiveShelf,
    loadUserShelves,
  } = useBookShelfStore();

  useEffect(() => {
    if (!activeUser) {
      router.push("/users");
      return;
    }

    // Load books for user's shelves
    loadUserShelves(activeUser.id);
  }, [activeUser, router, loadUserShelves]);

  if (!activeUser) {
    return null; // Router will redirect
  }

  const shelfCounts = {
    read: activeUser.shelves.read.length,
    currentlyReading: activeUser.shelves.currentlyReading.length,
    wantToRead: activeUser.shelves.wantToRead.length,
  };
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          My Books
        </h1>

        {activeUser && (
          <div className="mb-8">
            <ProfileCard
              user={activeUser}
              onUpdateProfile={(updatedUser) => {
                // Update users in localStorage
                const users = useUserStore.getState().users;
                const updatedUsers = users.map((user) =>
                  user.id === updatedUser.id ? updatedUser : user
                );

                saveUsers(updatedUsers);
                useUserStore.getState().setUsers(updatedUsers);
                useUserStore.getState().setActiveUser(updatedUser.id);
              }}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveShelf("read")}
            className={`flex items-center ${
              activeShelf === "read"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            } px-4 py-2 rounded-full font-medium transition-colors`}
          >
            Read
            <Badge className="ml-2">{shelfCounts.read}</Badge>
          </button>
          <button
            onClick={() => setActiveShelf("currentlyReading")}
            className={`flex items-center ${
              activeShelf === "currentlyReading"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            } px-4 py-2 rounded-full font-medium transition-colors`}
          >
            Currently Reading
            <Badge className="ml-2">{shelfCounts.currentlyReading}</Badge>
          </button>

          <button
            onClick={() => setActiveShelf("wantToRead")}
            className={`flex items-center ${
              activeShelf === "wantToRead"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            } px-4 py-2 rounded-full font-medium transition-colors`}
          >
            Want to Read
            <Badge className="ml-2">{shelfCounts.wantToRead}</Badge>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : shelfBooks[activeShelf].length === 0 ? (
          <div className="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No books in this shelf
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {activeShelf === "read" && "Add books you've read to this shelf."}
              {activeShelf === "currentlyReading" &&
                "Add books you're currently reading to this shelf."}
              {activeShelf === "wantToRead" &&
                "Add books you want to read to this shelf."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search for books
              </button>
            </div>
          </div>
        ) : (
          <BookGrid books={shelfBooks[activeShelf]} />
        )}
      </div>
    </AppLayout>
  );
}
