"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/ui/AppLayout";
import { useUIStore } from "@/lib/store/uiStore";

export default function DebugPage() {
  const { isDarkMode, toggleDarkMode } = useUIStore();
  const [cookieValue, setCookieValue] = useState<string | null>(null);
  const [localStorageValue, setLocalStorageValue] = useState<string | null>(
    null
  );
  const [domHasDarkClass, setDomHasDarkClass] = useState<boolean>(false);

  useEffect(() => {
    // Check DOM class
    const hasDarkClass = document.documentElement.classList.contains("dark");
    setDomHasDarkClass(hasDarkClass);

    // Check localStorage
    const lsVal = localStorage.getItem("darkMode");
    setLocalStorageValue(lsVal);

    // Check cookie
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const darkModeCookie = cookies.find((c) => c.startsWith("darkMode="));
    setCookieValue(darkModeCookie ? darkModeCookie.split("=")[1] : null);
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    toggleDarkMode();

    // Update our state after a brief delay to allow changes to apply
    setTimeout(() => {
      setDomHasDarkClass(document.documentElement.classList.contains("dark"));
      setLocalStorageValue(localStorage.getItem("darkMode"));

      const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
      const darkModeCookie = cookies.find((c) => c.startsWith("darkMode="));
      setCookieValue(darkModeCookie ? darkModeCookie.split("=")[1] : null);
    }, 100);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          Dark Mode Debug Page
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Current Status
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                UI Store isDarkMode:
              </span>
              <span
                className={`font-medium ${
                  isDarkMode
                    ? "text-green-600 dark:text-green-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {String(isDarkMode)}
              </span>
            </div>

            <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                DOM has "dark" class:
              </span>
              <span
                className={`font-medium ${
                  domHasDarkClass
                    ? "text-green-600 dark:text-green-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {String(domHasDarkClass)}
              </span>
            </div>

            <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                localStorage "darkMode" value:
              </span>
              <span className="font-medium text-purple-600 dark:text-purple-400">
                {localStorageValue || "(not set)"}
              </span>
            </div>

            <div className="grid grid-cols-2">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                cookie "darkMode" value:
              </span>
              <span className="font-medium text-purple-600 dark:text-purple-400">
                {cookieValue || "(not set)"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleToggleDarkMode}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            Toggle Dark Mode
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
            This box should be light blue in light mode and dark blue in dark
            mode.
          </div>

          <div className="p-6 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
            This box should be light green in light mode and dark green in dark
            mode.
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
