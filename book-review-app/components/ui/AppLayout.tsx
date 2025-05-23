import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { DarkModeToggle } from "../ui/Toggle";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeUser } = useUserStore();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center transition-all duration-300 hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-9 h-9 mr-3"
              >
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
                BookShelf
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-md transition-all duration-200 ${
                pathname === "/"
                  ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30"
              }`}
            >
              Home
            </Link>
            {activeUser && (
              <Link
                href="/my-books"
                className={`hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-md transition-all duration-200 ${
                  pathname === "/my-books"
                    ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                }`}
              >
                My Books
              </Link>
            )}
            <Link
              href="/users"
              className={`hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-md transition-all duration-200 ${
                pathname === "/users"
                  ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30"
              }`}
            >
              Users
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            <DarkModeToggle />

            {activeUser ? (
              <Link href="/users" className="flex items-center group">
                <div className="flex items-center">
                  <div className="relative w-10 h-10 mr-3 border-2 border-blue-400 dark:border-blue-500 rounded-full shadow-md overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500 dark:group-hover:border-blue-400">
                    <Image
                      src={activeUser.avatar || "/images/default-avatar.svg"}
                      alt={activeUser.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {activeUser.name}
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                href="/users"
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-400 dark:border-blue-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:shadow-md transition-all duration-200"
              >
                Select User
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow w-full px-8 py-8">{children}</main>
      <footer className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 py-8 shadow-md">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400"
                >
                  <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                </svg>
                <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
                  BookShelf
                </span>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2025 BookShelf. All rights reserved.
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-3 md:space-y-0">
              <a
                href="https://openlibrary.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Powered by OpenLibrary
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
