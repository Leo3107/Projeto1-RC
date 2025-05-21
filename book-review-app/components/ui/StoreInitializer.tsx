"use client";

import { useEffect } from "react";
import { initializeUserStore } from "@/lib/store/userStore";
import { initializeUIStore } from "@/lib/store/uiStore";
import { initializeAppData } from "@/lib/utils/localStorage";
import { initializeBookCache } from "@/lib/utils/bookCache";
import { setupSystemPreferenceListener } from "@/lib/utils/darkMode";

// This component initializes all stores
export function StoreInitializer() {
  useEffect(() => {
    // Initialize app data with sample data if first time
    initializeAppData();

    // Initialize book cache
    initializeBookCache();

    // Initialize user store
    initializeUserStore();

    // Initialize UI store for dark mode (this will also handle localStorage and initial class)
    initializeUIStore();

    // Set up listener for system preference changes for dark mode
    // This will call setDarkMode in uiStore if system preference changes
    const cleanupSystemPrefListener = setupSystemPreferenceListener();

    return () => {
      if (cleanupSystemPrefListener) cleanupSystemPrefListener();
    };
  }, []);

  return null;
}
