
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TabBar from "@/components/layout/TabBar";
import SearchInput from "@/components/shared/SearchInput";
import ListItemCard from "@/components/lists/ListItemCard";
import { ListItem } from "@/lib/types";
import TagBadge from "@/components/tags/TagBadge";
import { toast } from "sonner";
import { getAllItems, getAllTags, updateItem, deleteItem } from "@/lib/dataManager";

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ListItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [allItems, setAllItems] = useState<ListItem[]>([]);
  const [allTags, setAllTags] = useState<any[]>([]);

  useEffect(() => {
    const items = getAllItems();
    const tags = getAllTags();
    setAllItems(items);
    setAllTags(tags);
    setResults(items);
  }, []);

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
    let filtered = allItems;
    
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

  const refreshData = () => {
    const items = getAllItems();
    setAllItems(items);
    performSearch(query, selectedTags, showCompleted);
  };

  // Add handlers for toggle complete and delete
  const handleToggleComplete = (itemId: string) => {
    const item = allItems.find(i => i.id === itemId);
    if (item) {
      updateItem(itemId, { completed: !item.completed });
      refreshData();
      toast.success("Item status updated");
    }
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItem(itemId);
    refreshData();
    toast.success("Item deleted");
  };

  return (
    <div className="pb-16 h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 pt-4 pb-2 bg-white dark:bg-gray-800 fixed top-0 left-0 right-0 z-40 shadow-sm">
        <div className="flex items-center justify-center mb-2">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">LinkNest</h1>
        </div>
        <SearchInput onSearch={handleSearch} placeholder="Search items..." />
      </div>

      <div className="mt-16 px-4">
        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Filter by Tag:</h2>
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
          <label htmlFor="showCompleted" className="text-sm text-gray-700 dark:text-gray-300">
            Show completed items
          </label>
        </div>

        <div className="mt-6">
          <h1 className="text-xl font-bold mb-4 dark:text-white">
            {query || selectedTags.length > 0 ? "Results" : "Recent Items"}
          </h1>

          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((item) => (
                <ListItemCard
                  key={item.id}
                  item={item}
                  onClick={() => {}}
                  onToggleComplete={() => handleToggleComplete(item.id)}
                  onDelete={() => handleDeleteItem(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
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
