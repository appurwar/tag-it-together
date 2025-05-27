
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TabBar from "@/components/layout/TabBar";
import SearchInput from "@/components/shared/SearchInput";
import FloatingActionButton from "@/components/shared/FloatingActionButton";
import ListItemCard from "@/components/lists/ListItemCard";
import AddEditListItem from "@/components/lists/AddEditListItem";
import { List, ListItem } from "@/lib/types";
import { ArrowLeft, MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAllLists, getItemsByListId, createItem, updateItem, deleteItem, deleteList, extractPlaceFromGoogleMapsUrl } from "@/lib/dataManager";

const ListDetailPage = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  
  const [list, setList] = useState<List | undefined>(undefined);
  const [items, setItems] = useState<ListItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ListItem[]>([]);
  const [activeItems, setActiveItems] = useState<ListItem[]>([]);
  const [completedItems, setCompletedItems] = useState<ListItem[]>([]);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ListItem | null>(null);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ListItem | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [isGoogleMapsDialogOpen, setIsGoogleMapsDialogOpen] = useState(false);
  const [extractedPlace, setExtractedPlace] = useState<Partial<ListItem> | null>(null);
  
  useEffect(() => {
    if (!listId) return;
    
    refreshData();
  }, [listId]);

  const refreshData = () => {
    if (!listId) return;

    const allLists = getAllLists();
    const foundList = allLists.find(l => l.id === listId);
    
    if (foundList) {
      setList(foundList);
      const listItems = getItemsByListId(listId);
      setItems(listItems);
      setFilteredItems(listItems);
      setActiveItems(listItems.filter(item => !item.completed));
      setCompletedItems(listItems.filter(item => item.completed));
    } else {
      navigate("/lists");
    }
  };

  // Handle Google Maps URL sharing
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_MAPS_SHARE' && event.data?.url) {
        setGoogleMapsUrl(event.data.url);
        handleGoogleMapsShare(event.data.url);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGoogleMapsShare = async (url: string) => {
    const placeData = await extractPlaceFromGoogleMapsUrl(url);
    if (placeData) {
      setExtractedPlace(placeData);
      setIsGoogleMapsDialogOpen(true);
    } else {
      toast.error("Could not extract place information from the URL");
    }
  };
  
  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredItems(items);
      setActiveItems(items.filter(item => !item.completed));
      setCompletedItems(items.filter(item => item.completed));
      return;
    }
    
    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.name.toLowerCase().includes(query.toLowerCase())) ||
      item.location?.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredItems(filtered);
    setActiveItems(filtered.filter(item => !item.completed));
    setCompletedItems(filtered.filter(item => item.completed));
  };
  
  const handleDeleteList = () => {
    if (!listId) return;
    
    deleteList(listId);
    toast.success(`"${list?.name}" list deleted`);
    navigate("/lists");
  };
  
  const handleToggleComplete = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    updateItem(itemId, { completed: !item.completed });
    refreshData();
  };
  
  const handleSaveItem = (newItem: Partial<ListItem>) => {
    if (!listId) return;
    
    const isNewItem = !newItem.id;
    
    if (isNewItem) {
      createItem(listId, {
        title: newItem.title || "",
        url: newItem.url,
        description: newItem.description,
        tags: newItem.tags || [],
        location: newItem.location,
        completed: false,
        createdAt: new Date(),
      });
      toast.success("Item added successfully");
    } else {
      updateItem(newItem.id!, newItem);
      toast.success("Item updated successfully");
    }
    
    refreshData();
  };
  
  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    
    deleteItem(itemToDelete.id);
    refreshData();
    setIsDeleteItemModalOpen(false);
    setItemToDelete(null);
    toast.success("Item deleted successfully");
  };
  
  const handleEditItem = (item: ListItem) => {
    setEditingItem(item);
    setIsEditItemOpen(true);
  };

  const handleSaveGoogleMapsPlace = () => {
    if (!extractedPlace || !listId) return;

    createItem(listId, {
      title: extractedPlace.title || "",
      url: extractedPlace.url,
      description: extractedPlace.description,
      tags: extractedPlace.tags || [],
      location: extractedPlace.location,
      completed: false,
      createdAt: new Date(),
    });

    refreshData();
    setIsGoogleMapsDialogOpen(false);
    setExtractedPlace(null);
    setGoogleMapsUrl("");
    toast.success("Place added successfully");
  };
  
  return (
    <div className="pb-16 h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 pt-4 pb-2 bg-white dark:bg-gray-800 fixed top-0 left-0 right-0 z-40 shadow-sm">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => navigate("/lists")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold flex-1 text-left dark:text-white">
            {list?.icon && <span className="mr-2">{list.icon}</span>}
            {list?.name}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit List</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 dark:text-red-400"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <SearchInput onSearch={handleSearch} placeholder="Search in this list..." />
      </div>

      <div className="mt-24 px-4">
        {activeItems.length > 0 ? (
          <div>
            {activeItems.map((item) => (
              <ListItemCard
                key={item.id}
                item={item}
                onClick={() => handleEditItem(item)}
                onToggleComplete={() => handleToggleComplete(item.id)}
                onDelete={() => {
                  setItemToDelete(item);
                  setIsDeleteItemModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>This list is currently empty</p>
            <p className="text-sm mt-2">Add your first item using the + button below</p>
          </div>
        )}
        
        {completedItems.length > 0 && (
          <div className="mt-6">
            <div 
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                Completed ({completedItems.length})
              </h2>
              <Button variant="ghost" size="sm">
                {showCompleted ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {showCompleted && (
              <div>
                {completedItems.map((item) => (
                  <ListItemCard
                    key={item.id}
                    item={item}
                    onClick={() => handleEditItem(item)}
                    onToggleComplete={() => handleToggleComplete(item.id)}
                    onDelete={() => {
                      setItemToDelete(item);
                      setIsDeleteItemModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <FloatingActionButton onClick={() => setIsAddItemOpen(true)} />
      <TabBar />

      <AddEditListItem
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onSave={handleSaveItem}
      />
      
      <AddEditListItem
        isOpen={isEditItemOpen}
        onClose={() => {
          setIsEditItemOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        item={editingItem || undefined}
      />

      {/* Google Maps Place Dialog */}
      <AlertDialog open={isGoogleMapsDialogOpen} onOpenChange={setIsGoogleMapsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Place from Google Maps</AlertDialogTitle>
            <AlertDialogDescription>
              {extractedPlace && (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {extractedPlace.title}</p>
                  {extractedPlace.location && <p><strong>Location:</strong> {extractedPlace.location}</p>}
                  <p>Do you want to add this place to "{list?.name}"?</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveGoogleMapsPlace}>
              Add Place
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the list "{list?.name}" and all its items.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteList} className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isDeleteItemModalOpen} onOpenChange={setIsDeleteItemModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToDelete?.title}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListDetailPage;
