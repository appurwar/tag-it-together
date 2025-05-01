
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TabBar from "@/components/layout/TabBar";
import SearchInput from "@/components/shared/SearchInput";
import ListItemCard from "@/components/lists/ListItemCard";
import { ListItem } from "@/lib/types";
import TagBadge from "@/components/tags/TagBadge";

// Mock data combining all list items
const allMockItems: ListItem[] = [
  {
    id: "101",
    title: "Pizza Hut",
    description: "Need to try their new stuffed crust",
    tags: [{ id: "1", name: "Pizza" }, { id: "2", name: "Fast Food" }],
    location: "Downtown",
    completed: false,
    createdAt: new Date(2023, 4, 10),
    previewImage: "https://source.unsplash.com/random/300x200?pizza"
  },
  {
    id: "102",
    title: "Sushi Place",
    description: "Authentic Japanese cuisine",
    tags: [{ id: "3", name: "Japanese" }, { id: "4", name: "Sushi" }],
    location: "Midtown",
    completed: false,
    createdAt: new Date(2023, 4, 12)
  },
  {
    id: "103",
    title: "Burger Joint",
    description: "Best burgers in town",
    tags: [{ id: "5", name: "Burgers" }, { id: "2", name: "Fast Food" }],
    completed: true,
    createdAt: new Date(2023, 3, 28)
  },
  {
    id: "201",
    title: "Mountain Trail",
    description: "Beautiful mountain views, moderate difficulty",
    tags: [{ id: "7", name: "Mountains" }, { id: "8", name: "Moderate" }],
    location: "Rocky Mountain Park",
    completed: false,
    createdAt: new Date(2023, 4, 20),
    previewImage: "https://source.unsplash.com/random/300x200?mountain"
  }
];

const allTags = [
  { id: "1", name: "Pizza" },
  { id: "2", name: "Fast Food" },
  { id: "3", name: "Japanese" },
  { id: "4", name: "Sushi" },
  { id: "5", name: "Burgers" },
  { id: "7", name: "Mountains" },
  { id: "8", name: "Moderate" }
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ListItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery, selectedTags, showCompleted);
  };

  const toggleTag = (tagId: string) => {
    const updatedSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(updatedSelectedTags);
    performSearch(query, updatedSelectedTags, showCompleted);
  };

  const toggleShowCompleted = () => {
    const newShowCompleted = !showCompleted;
    setShowCompleted(newShowCompleted);
    performSearch(query, selectedTags, newShowCompleted);
  };

  const performSearch = (searchQuery: string, tags: string[], includeCompleted: boolean) => {
    let filtered = allMockItems;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by selected tags
    if (tags.length > 0) {
      filtered = filtered.filter(item =>
        item.tags.some(tag => tags.includes(tag.id))
      );
    }
    
    // Filter by completion status
    if (!includeCompleted) {
      filtered = filtered.filter(item => !item.completed);
    }
    
    setResults(filtered);
  };

  return (
    <div className="pb-16 h-screen bg-gray-50">
      <div className="px-4 pt-4 pb-2 bg-white fixed top-0 left-0 right-0 z-40 shadow-sm">
        <SearchInput onSearch={handleSearch} placeholder="Search items..." />
      </div>

      <div className="mt-16 px-4">
        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Filter by Tag:</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <TagBadge
                key={tag.id}
                tag={tag}
                onClick={() => toggleTag(tag.id)}
                className={selectedTags.includes(tag.id) 
                  ? "bg-ios-blue text-white" 
                  : ""
                }
              />
            ))}
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="showCompleted"
            checked={showCompleted}
            onChange={toggleShowCompleted}
            className="mr-2 rounded border-gray-300 text-ios-blue focus:ring-ios-blue"
          />
          <label htmlFor="showCompleted" className="text-sm text-gray-700">
            Show completed items
          </label>
        </div>

        <div className="mt-6">
          <h1 className="text-xl font-bold mb-4">
            {query || selectedTags.length > 0 ? "Results" : "Recent Items"}
          </h1>

          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((item) => (
                <ListItemCard
                  key={item.id}
                  item={item}
                  onClick={() => {}}
                  onToggleComplete={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No items found</p>
            </div>
          )}
        </div>
      </div>

      <TabBar />
    </div>
  );
};

export default SearchPage;
