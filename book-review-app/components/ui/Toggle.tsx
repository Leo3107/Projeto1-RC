import React, { useState } from "react";
import { Switch } from "@headlessui/react";

interface ToggleProps {
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export default function Toggle({
  isEnabled,
  onChange,
  label,
  size = "md",
  className = "",
}: ToggleProps) {
  const sizeClasses = {
    sm: "h-4 w-8",
    md: "h-6 w-11",
  };

  const translateClasses = {
    sm: "translate-x-4",
    md: "translate-x-6",
  };

  const thumbSizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Switch
        checked={isEnabled}
        onChange={onChange}
        className={`${
          isEnabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
        } relative inline-flex ${
          sizeClasses[size]
        } items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span
          className={`${
            isEnabled ? translateClasses[size] : "translate-x-0.5"
          } inline-block ${
            thumbSizeClasses[size]
          } transform rounded-full bg-white transition-transform`}
        />
      </Switch>
      {label && (
        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </div>
  );
}

export function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );

  const toggleDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled);

    if (enabled) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  return (
    <Toggle
      isEnabled={isDarkMode}
      onChange={toggleDarkMode}
      label="Dark Mode"
      className="ml-auto"
    />
  );
}
