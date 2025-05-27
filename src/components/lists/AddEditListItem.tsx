
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { ListItem, Tag } from "@/lib/types";
import TagBadge from "@/components/tags/TagBadge";
import { getAllTags, createTag } from "@/lib/dataManager";

interface AddEditListItemProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<ListItem>) => void;
  item?: ListItem;
}

const AddEditListItem = ({ isOpen, onClose, onSave, item }: AddEditListItemProps) => {
  const [title, setTitle] = useState(item?.title || "");
  const [url, setUrl] = useState(item?.url || "");
  const [description, setDescription] = useState(item?.description || "");
  const [location, setLocation] = useState(item?.location || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<Tag[]>(item?.tags || []);
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  // Reset form when opening for a new item or editing an existing one
  useEffect(() => {
    if (isOpen) {
      setTitle(item?.title || "");
      setUrl(item?.url || "");
      setDescription(item?.description || "");
      setLocation(item?.location || "");
      setTags(item?.tags || []);
      setTagInput("");
      setShowSuggestions(false);
      
      // Load all available tags
      const availableTags = getAllTags();
      setAllTags(availableTags);
    }
  }, [isOpen, item]);

  // Update suggestions when tag input changes
  useEffect(() => {
    if (!tagInput.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = allTags.filter(tag => 
      tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
      !tags.some(existingTag => existingTag.id === tag.id)
    );
    
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [tagInput, allTags, tags]);

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    // Check if tag already exists in current tags
    if (tags.some(tag => tag.name.toLowerCase() === tagInput.toLowerCase())) {
      setTagInput("");
      return;
    }
    
    // Check if tag exists in all tags or create new one
    let newTag = allTags.find(tag => tag.name.toLowerCase() === tagInput.toLowerCase());
    
    if (!newTag) {
      newTag = createTag(tagInput.trim());
      setAllTags(prev => [...prev, newTag!]);
    }
    
    setTags(prev => [...prev, newTag!]);
    setTagInput("");
    setShowSuggestions(false);
  };

  const selectTagSuggestion = (tag: Tag) => {
    if (!tags.some(existingTag => existingTag.id === tag.id)) {
      setTags(prev => [...prev, tag]);
    }
    setTagInput("");
    setShowSuggestions(false);
  };

  const removeTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      id: item?.id,
      title,
      url,
      description,
      location,
      tags,
      completed: item?.completed || false,
      createdAt: item?.createdAt || new Date(),
      previewImage: item?.previewImage,
    });
    
    onClose();
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        selectTagSuggestion(suggestions[0]);
      } else {
        handleAddTag();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url">Link (optional)</Label>
            <Input 
              id="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder="https://example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Item title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Notes/Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Add notes or description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Add location"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="relative">
              <div className="flex">
                <Input 
                  id="tags" 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add a tag"
                  className="flex-1"
                />
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={handleAddTag}
                  className="ml-2"
                >
                  Add
                </Button>
              </div>
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-32 overflow-y-auto">
                  {suggestions.map((tag) => (
                    <div
                      key={tag.id}
                      onClick={() => selectTagSuggestion(tag)}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center">
                    <TagBadge tag={tag} />
                    <button
                      type="button"
                      className="ml-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                      onClick={() => removeTag(tag.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditListItem;
