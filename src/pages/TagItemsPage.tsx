
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ListItem, Tag } from "@/lib/types";
import TabBar from "@/components/layout/TabBar";
import ListItemCard from "@/components/lists/ListItemCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getItemsByTagId, getAllTags, updateItem, deleteItem } from "@/lib/dataManager";
import AddEditListItem from "@/components/lists/AddEditListItem";
import { toast } from "sonner";

const TagItemsPage = () => {
  const { tagId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<ListItem[]>([]);
  const [tag, setTag] = useState<Tag | null>(null);
  const [editingItem, setEditingItem] = useState<ListItem | null>(null);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ListItem | null>(null);

  useEffect(() => {
    if (tagId) {
      refreshData();
    }
  }, [tagId]);

  const refreshData = () => {
    if (tagId) {
      const filteredItems = getItemsByTagId(tagId);
      setItems(filteredItems);
      
      // Find the tag name
      const allTags = getAllTags();
      const matchingTag = allTags.find(t => t.id === tagId);
      if (matchingTag) {
        setTag(matchingTag);
      }
    }
  };

  // Add handler for toggling completion status
  const handleToggleComplete = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      updateItem(itemId, { completed: !item.completed });
      refreshData();
    }
  };

  // Add handler for deleting items
  const handleDeleteItem = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      refreshData();
      setIsDeleteConfirmOpen(false);
      setItemToDelete(null);
      toast.success("Item deleted successfully");
    }
  };

  const handleEditItem = (item: ListItem) => {
    setEditingItem(item);
    setIsEditItemOpen(true);
  };

  const handleSaveItem = () => {
    setIsEditItemOpen(false);
    setEditingItem(null);
    refreshData();
  };

  return (
    <div className="pb-16 h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 pt-4 pb-2 bg-white dark:bg-gray-800 fixed top-0 left-0 right-0 z-40 shadow-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-2 -ml-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold dark:text-white">
          {tag ? `#${tag.name}` : 'Tag Items'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {items.length} {items.length === 1 ? 'item' : 'items'} with this tag
        </p>
      </div>

      <div className="mt-28 px-4 pb-16">
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map(item => (
              <ListItemCard
                key={item.id}
                item={item}
                onClick={() => handleEditItem(item)}
                onToggleComplete={() => handleToggleComplete(item.id)}
                onDelete={() => {
                  setItemToDelete(item);
                  setIsDeleteConfirmOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>No items found with this tag</p>
          </div>
        )}
      </div>

      <TabBar />

      {/* Edit Item Dialog */}
      {editingItem && (
        <AddEditListItem
          isOpen={isEditItemOpen}
          onClose={() => setIsEditItemOpen(false)}
          onSave={handleSaveItem}
          listId={editingItem.id.split('_')[0]}
          item={editingItem}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagItemsPage;
