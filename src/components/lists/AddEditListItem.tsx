
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { ListItem, Tag } from "@/lib/types";
import TagBadge from "@/components/tags/TagBadge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Mock data of all existing tags for suggestions
const mockAllTags: Tag[] = [
  { id: "1", name: "Pizza" },
  { id: "2", name: "Fast Food" },
  { id: "3", name: "Japanese" },
  { id: "4", name: "Sushi" },
  { id: "5", name: "Burgers" },
  { id: "6", name: "Mexican" },
  { id: "7", name: "Mountains" },
  { id: "8", name: "Moderate" },
  { id: "9", name: "Fiction" },
  { id: "10", name: "Classic" },
  { id: "11", name: "Dystopian" },
  { id: "12", name: "Sci-Fi" },
  { id: "13", name: "Action" },
  { id: "14", name: "Drama" }
];

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
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);

  // Reset form when opening for a new item or editing an existing one
  useEffect(() => {
    if (isOpen) {
      setTitle(item?.title || "");
      setUrl(item?.url || "");
      setDescription(item?.description || "");
      setLocation(item?.location || "");
      setTags(item?.tags || []);
      setTagInput("");
      setIsTagPopoverOpen(false);
    }
  }, [isOpen, item]);

  // Get filtered tag suggestions
  const getFilteredSuggestions = () => {
    if (!tagInput.trim()) return [];
    
    return mockAllTags.filter(tag => 
      tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
      !tags.some(existingTag => existingTag.id === tag.id)
    );
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    // Check if tag already exists in current tags
    if (tags.some(tag => tag.name.toLowerCase() === tagInput.toLowerCase())) {
      setTagInput("");
      setIsTagPopoverOpen(false);
      return;
    }
    
    // Check if tag already exists in global tags
    const existingTag = mockAllTags.find(
      tag => tag.name.toLowerCase() === tagInput.toLowerCase()
    );
    
    const newTag: Tag = existingTag || {
      id: Date.now().toString(),
      name: tagInput.trim(),
    };
    
    setTags([...tags, newTag]);
    setTagInput("");
    setIsTagPopoverOpen(false);
  };

  const selectTagSuggestion = (tag: Tag) => {
    if (!tags.some(existingTag => existingTag.id === tag.id)) {
      setTags(prevTags => [...prevTags, tag]);
    }
    setTagInput("");
    setIsTagPopoverOpen(false);
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

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    
    // Open popover if there are suggestions
    const suggestions = mockAllTags.filter(tag => 
      tag.name.toLowerCase().includes(value.toLowerCase()) &&
      !tags.some(existingTag => existingTag.id === tag.id)
    );
    
    setIsTagPopoverOpen(value.trim().length > 0 && suggestions.length > 0);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Escape') {
      setIsTagPopoverOpen(false);
    }
  };

  const filteredSuggestions = getFilteredSuggestions();

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
              <Popover open={isTagPopoverOpen} onOpenChange={setIsTagPopoverOpen}>
                <PopoverTrigger asChild>
                  <div className="flex">
                    <Input 
                      id="tags" 
                      value={tagInput} 
                      onChange={handleTagInputChange}
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
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full" align="start">
                  <Command>
                    <CommandList>
                      {filteredSuggestions.length > 0 ? (
                        <CommandGroup heading="Tag suggestions">
                          {filteredSuggestions.map((tag) => (
                            <CommandItem
                              key={tag.id}
                              onSelect={() => selectTagSuggestion(tag)}
                              className="cursor-pointer"
                            >
                              {tag.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : (
                        <CommandEmpty>No matching tags found.</CommandEmpty>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
