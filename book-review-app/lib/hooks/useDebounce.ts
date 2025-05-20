import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFn = useCallback(
    debounce((...args: Parameters<T>) => {
      callback(...args);
    }, delay),
    [callback, delay]
  );

  return debouncedFn as T;
}
