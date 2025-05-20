// Helper functions for dark mode handling

// Initialize dark mode based on system preference or saved setting
export function initializeDarkMode() {
  // Check if we're in a browser environment
  if (typeof window === "undefined") return;

  const savedDarkMode = localStorage.getItem("darkMode");

  if (savedDarkMode !== null) {
    // If a preference was saved, use that
    const isDarkMode = savedDarkMode === "true";
    applyDarkMode(isDarkMode);
  } else {
    // Otherwise, use system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    applyDarkMode(prefersDark);
    localStorage.setItem("darkMode", prefersDark.toString());
  }
}

// Apply dark mode to the document
export function applyDarkMode(isDarkMode: boolean) {
  if (typeof document === "undefined") return;

  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// Update state when system preferences change
export function setupSystemPreferenceListener() {
  if (typeof window === "undefined") return;

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // Only update if user hasn't explicitly set a preference
  const handleChange = (event: MediaQueryListEvent) => {
    if (localStorage.getItem("darkMode") === null) {
      applyDarkMode(event.matches);
      localStorage.setItem("darkMode", event.matches.toString());
    }
  };

  mediaQuery.addEventListener("change", handleChange);

  // Return a cleanup function
  return () => mediaQuery.removeEventListener("change", handleChange);
}
