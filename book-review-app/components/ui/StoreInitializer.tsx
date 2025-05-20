"use client";

import { useEffect } from "react";
import { initializeUserStore } from "@/lib/store/userStore";
import { initializeUIStore, setupUIStoreListeners } from "@/lib/store/uiStore";
import { initializeAppData } from "@/lib/utils/localStorage";
import { initializeBookCache } from "@/lib/utils/bookCache";

// This component initializes all stores
export function StoreInitializer() {
  useEffect(() => {
    // Initialize app data with sample data if first time
    initializeAppData();

    // Initialize book cache
    initializeBookCache();

    // Initialize user store
    initializeUserStore();

    // Initialize UI store for dark mode
    initializeUIStore();
    setupUIStoreListeners();
  }, []);

  return null;
}
