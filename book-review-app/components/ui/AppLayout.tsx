import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { useUIStore } from "@/lib/store/uiStore";
import { DarkModeToggle } from "../ui/Toggle";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeUser } = useUserStore();
  const { isDarkMode } = useUIStore();

  useEffect(() => {
    // Apply dark mode class based on the store state
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 mr-2"
              >
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
              BookShelf
            </Link>
          </div>

          <nav className="hidden md:flex space-x-6 text-gray-600 dark:text-gray-300">
            <Link
              href="/"
              className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                pathname === "/"
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : ""
              }`}
            >
              Home
            </Link>
            {activeUser && (
              <Link
                href="/my-books"
                className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                  pathname === "/my-books"
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : ""
                }`}
              >
                My Books
              </Link>
            )}
            <Link
              href="/users"
              className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                pathname === "/users"
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : ""
              }`}
            >
              Users
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <DarkModeToggle />

            {activeUser ? (
              <Link href="/users" className="flex items-center">
                <div className="flex items-center">
                  <div className="relative w-8 h-8 mr-2">
                    <Image
                      src={activeUser.avatar || "/images/default-avatar.svg"}
                      alt={activeUser.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                    {activeUser.name}
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                href="/users"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2025 BookShelf. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="https://openlibrary.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Powered by OpenLibrary
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
