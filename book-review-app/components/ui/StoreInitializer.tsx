"use client";

import { useEffect } from "react";
import { initializeUserStore } from "@/lib/store/userStore";
import { initializeUIStore, setupUIStoreListeners } from "@/lib/store/uiStore";
import { initializeAppData } from "@/lib/utils/localStorage";
import { initializeBookCache } from "@/lib/utils/bookCache";
import {
  initializeDarkMode,
  setupSystemPreferenceListener,
} from "@/lib/utils/darkMode";

// This component initializes all stores
export function StoreInitializer() {
  useEffect(() => {
    // Initialize app data with sample data if first time
    initializeAppData();

    // Initialize book cache
    initializeBookCache();

    // Initialize user store
    initializeUserStore();

    // Initialize dark mode based on system preference or saved setting
    initializeDarkMode();

    // Initialize UI store for dark mode and set up listeners
    initializeUIStore();
    setupUIStoreListeners();

    // Set up listener for system preference changes
    const cleanupListener = setupSystemPreferenceListener();

    return () => {
      if (cleanupListener) cleanupListener();
    };
  }, []);

  return null;
}
