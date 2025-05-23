import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useUIStore } from "@/lib/store/uiStore";
import { DarkModeToggle } from "../ui/Toggle";
import Button from "@/components/ui/Button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { isDarkMode } = useUIStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const isLoadingSession = status === "loading";

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
            {session?.user && (
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

            {isLoadingSession ? (
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            ) : session?.user ? (
              <div className="flex items-center space-x-2">
                {session.user.image && session.user.name && (
                  <Link href="/my-books" className="flex items-center">
                    <div className="relative w-8 h-8 mr-2">
                      <Image
                        src={session.user.image}
                        alt={session.user.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                      {session.user.name}
                    </span>
                  </Link>
                )}
                <Button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  variant="ghost"
                  size="sm"
                  className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => signIn()}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
                >
                  Sign In
                </Button>
                <Link href="/auth/signup" passHref>
                  <Button
                    as="a"
                    variant="primary"
                    color="primary"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} BookShelf. All rights reserved.
          <p className="mt-1">
            Powered by Next.js, Tailwind CSS, and data from{" "}
            <a
              href="https://openlibrary.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Open Library
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
