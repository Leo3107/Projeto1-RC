import React from "react";
import { Shelf } from "@/lib/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  className = "",
}: BadgeProps) {
  const baseClasses = "inline-flex items-center font-medium rounded-full";

  const variantClasses = {
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    info: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}

// Helper function to get the correct variant for a shelf
export function getShelfBadgeVariant(
  shelf: Shelf
): "primary" | "success" | "warning" {
  switch (shelf) {
    case "read":
      return "success";
    case "currentlyReading":
      return "primary";
    case "wantToRead":
      return "warning";
    default:
      return "primary";
  }
}

// Helper function to format shelf name for display
export function formatShelfName(shelf: Shelf): string {
  switch (shelf) {
    case "read":
      return "Read";
    case "currentlyReading":
      return "Currently Reading";
    case "wantToRead":
      return "Want to Read";
    default:
      return shelf;
  }
}
