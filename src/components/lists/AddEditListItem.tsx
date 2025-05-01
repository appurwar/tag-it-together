
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { ListItem, Tag } from "@/lib/types";
import TagBadge from "@/components/tags/TagBadge";

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

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag: Tag = {
      id: Date.now().toString(),
      name: tagInput.trim(),
    };
    
    setTags([...tags, newTag]);
    setTagInput("");
  };

  const removeTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      title,
      url,
      description,
      location,
      tags,
      completed: item?.completed || false,
      createdAt: item?.createdAt || new Date(),
    });
    
    onClose();
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
            <div className="flex">
              <Input 
                id="tags" 
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)} 
                placeholder="Add a tag"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
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
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center">
                    <TagBadge tag={tag} />
                    <button
                      className="ml-1 text-gray-400 hover:text-red-500"
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
