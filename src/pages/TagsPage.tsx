
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TabBar from "@/components/layout/TabBar";
import SearchInput from "@/components/shared/SearchInput";
import { Tag } from "@/lib/types";
import TagBadge from "@/components/tags/TagBadge";
import FloatingActionButton from "@/components/shared/FloatingActionButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Helper functions for localStorage persistence
const TAGS_STORAGE_KEY = 'linknest_tags';

const getStoredTags = (): Tag[] => {
  try {
    const stored = localStorage.getItem(TAGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading tags from storage:', error);
  }
  
  // Return default tags if nothing stored
  return [
    { id: "1", name: "Pizza", count: 1 },
    { id: "2", name: "Fast Food", count: 2 },
    { id: "3", name: "Japanese", count: 1 },
    { id: "4", name: "Sushi", count: 1 },
    { id: "5", name: "Burgers", count: 1 },
    { id: "6", name: "Mexican", count: 1 },
    { id: "7", name: "Mountains", count: 1 },
    { id: "8", name: "Moderate", count: 1 },
    { id: "9", name: "Fiction", count: 2 },
    { id: "10", name: "Classic", count: 1 },
    { id: "11", name: "Dystopian", count: 1 },
    { id: "12", name: "Sci-Fi", count: 1 },
    { id: "13", name: "Action", count: 1 },
    { id: "14", name: "Drama", count: 1 }
  ];
};

const storeTags = (tags: Tag[]) => {
  try {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
  } catch (error) {
    console.error('Error saving tags to storage:', error);
  }
};

const TagsPage = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    const storedTags = getStoredTags();
    
    // Sort tags alphabetically
    const sortedTags = [...storedTags].sort((a, b) => a.name.localeCompare(b.name));
    
    setTags(sortedTags);
    setFilteredTags(sortedTags);
  }, []);

  const updateTags = (newTags: Tag[]) => {
    setTags(newTags);
    setFilteredTags(newTags);
    storeTags(newTags);
  };
  
  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredTags(tags);
      return;
    }
    
    const filtered = tags.filter(tag => 
      tag.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTags(filtered);
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    
    // Check if tag already exists
    if (tags.some(tag => tag.name.toLowerCase() === newTagName.toLowerCase())) {
      toast.error("This tag already exists");
      return;
    }
    
    const newTag: Tag = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      count: 0
    };
    
    const updatedTags = [...tags, newTag].sort((a, b) => a.name.localeCompare(b.name));
    updateTags(updatedTags);
    setNewTagName("");
    setIsAddTagOpen(false);
    toast.success(`Tag "${newTagName}" created successfully`);
  };

  return (
    <div className="pb-16 h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 pt-4 pb-2 bg-white dark:bg-gray-800 fixed top-0 left-0 right-0 z-40 shadow-sm">
        <div className="flex items-center justify-center mb-2">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">LinkNest</h1>
        </div>
        <SearchInput onSearch={handleSearch} placeholder="Search tags..." />
      </div>

      <div className="mt-16 px-4 py-4">
        {filteredTags.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {filteredTags.map((tag) => (
              <div 
                key={tag.id} 
                className="flex flex-col items-center"
                onClick={() => navigate(`/tags/${tag.id}`)}
              >
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm w-full">
                  <TagBadge 
                    tag={tag} 
                    className="text-center w-full justify-center text-sm py-1.5"
                    navigateOnClick={true}
                  />
                  <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                    {tag.count} {tag.count === 1 ? "item" : "items"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>No tags found</p>
          </div>
        )}
      </div>

      <FloatingActionButton onClick={() => setIsAddTagOpen(true)} />
      <TabBar />

      {/* Add Tag Dialog */}
      <Dialog open={isAddTagOpen} onOpenChange={setIsAddTagOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="tagName">Tag Name</Label>
            <Input
              id="tagName"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
              className="mt-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTagOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTag}>Create Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagsPage;
