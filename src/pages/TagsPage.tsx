
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
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger 
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { getAllTags, createTag, deleteTag, getAllItems, updateItem } from "@/lib/dataManager";

const TagsPage = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

  useEffect(() => {
    const storedTags = getAllTags();
    setTags(storedTags);
    setFilteredTags(storedTags);
  }, []);

  const refreshTags = () => {
    const updatedTags = getAllTags();
    setTags(updatedTags);
    setFilteredTags(updatedTags);
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
    
    createTag(newTagName.trim());
    refreshTags();
    setNewTagName("");
    setIsAddTagOpen(false);
    toast.success(`Tag "${newTagName}" created successfully`);
  };

  const handleDeleteTag = () => {
    if (!tagToDelete) return;

    // Get all items and remove the tag from them
    const allItems = getAllItems();
    const itemsWithTag = allItems.filter(item => 
      item.tags.some(tag => tag.id === tagToDelete.id)
    );

    // Remove the tag from all items
    itemsWithTag.forEach(item => {
      const updatedTags = item.tags.filter(tag => tag.id !== tagToDelete.id);
      updateItem(item.id, { tags: updatedTags });
    });

    // Delete the tag
    deleteTag(tagToDelete.id);
    refreshTags();
    setIsDeleteConfirmOpen(false);
    setTagToDelete(null);
    toast.success(`Tag "${tagToDelete.name}" deleted and removed from ${itemsWithTag.length} items`);
  };

  return (
    <div className="pb-16 h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 pt-4 pb-4 bg-white dark:bg-gray-800 fixed top-0 left-0 right-0 z-40 shadow-sm">
        <div className="flex items-center justify-center mb-3">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">LinkNest</h1>
        </div>
        <SearchInput onSearch={handleSearch} placeholder="Search tags..." />
      </div>

      <div className="mt-24 px-4 py-4">
        {filteredTags.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {filteredTags.map((tag) => (
              <ContextMenu key={tag.id}>
                <ContextMenuTrigger asChild>
                  <div 
                    className="flex flex-col items-center cursor-pointer"
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
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem 
                    className="text-red-500 dark:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTagToDelete(tag);
                      setIsDeleteConfirmOpen(true);
                    }}
                  >
                    Delete Tag
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
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

      {/* Delete Tag Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the tag "{tagToDelete?.name}"?</p>
            <p className="text-sm text-gray-500 mt-2">
              This will remove this tag from all items that currently use it. This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTag}>Delete Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagsPage;
