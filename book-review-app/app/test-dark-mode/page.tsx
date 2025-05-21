"use client";

import React, { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store/uiStore";
import AppLayout from "@/components/ui/AppLayout";
import { DarkModeToggle } from "@/components/ui/Toggle";
import { useToastStore } from "@/lib/store/toastStore";

export default function TestDarkModePage() {
  const { isDarkMode } = useUIStore();
  const { addToast } = useToastStore();
  const [documentHasDarkClass, setDocumentHasDarkClass] = useState(false);
  const [localStorageValue, setLocalStorageValue] = useState("");

  // Effect to check DOM and localStorage
  useEffect(() => {
    // Check if dark mode class is applied to documentElement
    const darkClass = document.documentElement.classList.contains("dark");
    setDocumentHasDarkClass(darkClass);

    // Check localStorage value
    try {
      const storedValue = localStorage.getItem("darkMode");
      setLocalStorageValue(storedValue || "not set");
    } catch (error) {
      console.error("Error reading localStorage:", error);
      setLocalStorageValue("error reading");
    }

    // Log state for debugging
    console.log("Dark Mode State Check:", {
      isDarkModeInStore: isDarkMode,
      isDarkModeInDOM: darkClass,
      darkModeInLocalStorage: localStorage.getItem("darkMode"),
    });
  }, [isDarkMode]);
  const handleCreateToast = (message: string) => {
    addToast(message, "info", 3000);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          Dark Mode Test Page
        </h1>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Current Dark Mode State
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                UI Store isDarkMode:
              </span>
              <span
                className={`font-bold ${
                  isDarkMode
                    ? "text-green-600 dark:text-green-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {isDarkMode ? "True" : "False"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Document has "dark" class:
              </span>
              <span
                className={`font-bold ${
                  documentHasDarkClass
                    ? "text-green-600 dark:text-green-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {documentHasDarkClass ? "True" : "False"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                localStorage darkMode value:
              </span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {localStorageValue}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
            <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">
              Toggle Dark Mode
            </h3>
            <div className="flex items-center justify-center">
              <DarkModeToggle />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Visual Test Elements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg text-blue-800 dark:text-blue-100">
              This box should be light blue in light mode and dark blue in dark
              mode
            </div>

            <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg text-green-800 dark:text-green-100">
              This box should be light green in light mode and dark green in
              dark mode
            </div>

            <button
              onClick={() =>
                handleCreateToast(
                  "Current mode: " + (isDarkMode ? "Dark" : "Light")
                )
              }
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Show Toast Notification
            </button>

            <button
              onClick={() => {
                console.log("Manual sync check triggered");
                const darkInDOM =
                  document.documentElement.classList.contains("dark");
                const darkInStore = isDarkMode;
                const darkInStorage =
                  localStorage.getItem("darkMode") === "true";

                handleCreateToast(
                  `Sync Check - DOM: ${darkInDOM ? "dark" : "light"}, Store: ${
                    darkInStore ? "dark" : "light"
                  }, Storage: ${darkInStorage ? "dark" : "light"}`
                );
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Check Sync Status
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
