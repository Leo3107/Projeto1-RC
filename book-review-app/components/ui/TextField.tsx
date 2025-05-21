import React, { forwardRef, useState } from "react";

interface TextFieldProps {
  id: string;
  label?: string;
  type?: "text" | "email" | "password" | "number" | "url";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  autoFocus?: boolean;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      label,
      type = "text",
      placeholder,
      value,
      onChange,
      error,
      required = false,
      autoFocus = false,
      className = "",
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      setIsFocused(true);
      if (onFocus) onFocus();
    };

    const handleBlur = () => {
      setIsFocused(false);
      if (onBlur) onBlur();
    };
    
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className={`relative ${isFocused ? 'transform transition-transform duration-200' : ''}`}>
          <input
            ref={ref}
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            autoFocus={autoFocus}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full rounded-md border ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
            } bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 
              shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200
              ${isFocused ? 'border-blue-400 dark:border-blue-500' : ''}`}
          />
          {type === 'search' && value && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                const resetEvent = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
                onChange(resetEvent);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
