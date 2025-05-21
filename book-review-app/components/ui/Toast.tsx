import React, { useState, useEffect } from "react";
import { useToastStore, ToastType } from "@/lib/store/toastStore";

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export function Toast({ id, message, type, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => removeToast(id), 300); // Allow animation to complete before removal
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, removeToast]);

  const typeClasses = {
    success:
      "bg-green-100 border-green-500 text-green-800 dark:bg-green-800/30 dark:border-green-600 dark:text-green-200",
    error:
      "bg-red-100 border-red-500 text-red-800 dark:bg-red-800/30 dark:border-red-600 dark:text-red-200",
    warning:
      "bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-800/30 dark:border-yellow-600 dark:text-yellow-200",
    info: "bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-800/30 dark:border-blue-600 dark:text-blue-200",
  };
  const typeIcons = {
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    warning: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    info: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`flex items-center p-4 mb-3 max-w-sm rounded-lg shadow-md border-l-4 transition-opacity duration-300 ${
        typeClasses[type]
      } ${isVisible ? "opacity-100" : "opacity-0"}`}
      role="alert"
    >
      <div className="inline-flex flex-shrink-0 mr-3">{typeIcons[type]}</div>
      <div className="text-base font-medium">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-300 inline-flex items-center justify-center h-8 w-8"
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => removeToast(id), 300);
        }}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed bottom-0 right-0 p-6 z-50 flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
        />
      ))}
    </div>
  );
}
