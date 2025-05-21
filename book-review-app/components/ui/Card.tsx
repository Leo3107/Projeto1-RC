import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function Card({
  children,
  className = "",
  onClick,
  hoverable = false,
}: CardProps) {
  const hoverClass = hoverable
    ? "hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    : "";
  const cursorClass = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden ${hoverClass} ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
