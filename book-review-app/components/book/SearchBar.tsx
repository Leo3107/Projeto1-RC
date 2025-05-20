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
        <TextField
          id="search"
          placeholder="Search for books..."
          value={query}
          onChange={handleQueryChange}
          className="flex-grow"
        />
        <Button onClick={toggleFilters} variant="secondary">
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
      </div>

      {isFilterOpen && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TextField
              id="genre"
              label="Genre"
              placeholder="e.g., science fiction, mystery"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
            <TextField
              id="year"
              label="Publication Year"
              placeholder="e.g., 2020"
              value={year}
              onChange={handleYearChange}
              type="text" // Using text to handle empty values better
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={clearFilters} variant="ghost">
              Clear Filters
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
      )}
    </div>
  );
}
