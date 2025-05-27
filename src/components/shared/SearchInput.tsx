
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchInputProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const SearchInput = ({ 
  onSearch,
  placeholder = "Search..." 
}: SearchInputProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (onSearch) {
      onSearch(newQuery);
    }
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        className="pl-10 py-2 bg-gray-100 border-0 rounded-xl w-full focus:ring-1 focus:ring-ios-blue dark:bg-gray-700 dark:text-gray-100"
        placeholder={placeholder}
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchInput;
