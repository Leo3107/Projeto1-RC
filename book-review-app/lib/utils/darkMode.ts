// Helper functions for dark mode handling
import { useUIStore } from "@/lib/store/uiStore"; // ES6 import

// This function is no longer strictly necessary here as uiStore now handles initialization logic,
// but can be kept if direct application of class is needed elsewhere, or for clarity.
export function applyDarkMode(isDarkMode: boolean) {
  if (typeof document === "undefined") return;

  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// Initialize dark mode - This function's core logic is moved to uiStore.initializeUIStore
// It can be removed or simplified if StoreInitializer directly calls uiStore.initializeUIStore
export function initializeDarkMode() {
  // The primary initialization logic is now in uiStore.ts
  // This function can be a wrapper or be deprecated.
  // For now, let's assume StoreInitializer will call uiStore.initializeUIStore directly.
  console.log(
    "initializeDarkMode from darkMode.ts is called, but primary logic is in uiStore.ts"
  );
}

// Update state when system preferences change
export function setupSystemPreferenceListener() {
  if (typeof window === "undefined") return undefined; // Return undefined if not in browser

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = (event: MediaQueryListEvent) => {
    // Only update if user hasn't explicitly set a preference via toggle (localStorage would be set)
    // If localStorage.getItem("darkMode") is null, it means user hasn't manually toggled.
    // However, initializeUIStore now sets localStorage based on system pref if it's null.
    // So, this listener should update the store if the system preference changes *after* initial load.

    const { setDarkMode } = useUIStore.getState(); // Get action from store
    setDarkMode(event.matches);
    // The setDarkMode action in uiStore will handle localStorage, cookie, and class updates.
  };

  mediaQuery.addEventListener("change", handleChange);

  // Return a cleanup function
  return () => mediaQuery.removeEventListener("change", handleChange);
}
