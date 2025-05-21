import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  type = "button",
  className = "",
}: ButtonProps) {
  const baseClasses =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-md hover:from-blue-700 hover:to-blue-800 active:translate-y-0.5 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 active:translate-y-0.5 focus:ring-gray-500",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 active:translate-y-0.5 focus:ring-gray-500",
  };

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled
    ? "opacity-60 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  );
}
