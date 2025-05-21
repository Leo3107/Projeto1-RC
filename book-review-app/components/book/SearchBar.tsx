import { useState, useEffect } from "react";
import { useDebouncedCallback } from "@/lib/hooks/useDebounce";
import TextField from "../ui/TextField";
import Button from "../ui/Button";

interface SearchBarProps {
  onSearch: (query: string, filters: { genre?: string; year?: number }) => void;
  initialQuery?: string;
}

export default function SearchBar({
  onSearch,
  initialQuery = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Run search when component mounts with initial query
  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedSearch = useDebouncedCallback((searchQuery: string) => {
    if (searchQuery.trim().length > 0) {
      const filters = {
        ...(genre ? { genre } : {}),
        ...(year ? { year: parseInt(year, 10) } : {}),
      };
      onSearch(searchQuery, filters);
    }
  }, 500);

  const handleSearch = () => {
    if (query.trim().length > 0) {
      const filters = {
        ...(genre ? { genre } : {}),
        ...(year ? { year: parseInt(year, 10) } : {}),
      };
      onSearch(query, filters);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length > 0) {
      debouncedSearch(value);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers or empty string
    if (value === "" || /^\d+$/.test(value)) {
      setYear(value);
    }
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const clearFilters = () => {
    setGenre("");
    setYear("");
    if (query.trim().length > 0) {
      onSearch(query, {});
    }
  };

  const applyFilters = () => {
    if (query.trim().length > 0) {
      const filters = {
        ...(genre ? { genre } : {}),
        ...(year ? { year: parseInt(year, 10) } : {}),
      };
      onSearch(query, filters);
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className={`relative flex-grow transition-all duration-200 ${isFocused ? 'ring-2 ring-blue-400 dark:ring-blue-500 ring-opacity-50 scale-[1.01]' : ''}`}>
          <TextField
            id="search"
            placeholder="Search for books..."
            value={query}
            onChange={handleQueryChange}
            className="flex-grow shadow-sm"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {query && (
            <button 
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full p-1 transition-colors"
              onClick={() => {
                setQuery('');
                onSearch('', {});
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <Button onClick={toggleFilters} variant="secondary" className="flex-shrink-0 shadow-sm hover:shadow-md transition-shadow">
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            Filter
          </span>
        </Button>
      </div>      {isFilterOpen && (
        <div className="p-5 bg-gray-50 dark:bg-gray-800/90 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg animate-fade-in transform transition-all">
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4">Refine your search</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <TextField
              id="genre"
              label="Genre"
              placeholder="e.g., science fiction, mystery"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="shadow-sm"
            />
            <TextField
              id="year"
              label="Publication Year"
              placeholder="e.g., 2020"
              value={year}
              onChange={handleYearChange}
              type="text" // Using text to handle empty values better
              className="shadow-sm"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              onClick={clearFilters} 
              variant="ghost"
              className="hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
            >
              Clear Filters
            </Button>
            <Button 
              onClick={applyFilters}
              className="shadow-sm hover:shadow transition-shadow"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
