import React from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

export default function Skeleton({
  width = "w-full",
  height = "h-24",
  className = "",
  rounded = "md",
}: SkeletonProps) {
  const roundedClass = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <div
      className={`${width} ${height} ${roundedClass[rounded]} bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
    />
  );
}

// BookCardSkeleton component for book search results
export function BookCardSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <Skeleton height="h-56" className="mb-2" />
      <Skeleton height="h-6" width="w-3/4" className="mb-2" />
      <Skeleton height="h-4" width="w-1/2" className="mb-4" />
      <Skeleton height="h-8" className="mt-auto" />
    </div>
  );
}
