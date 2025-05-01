
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

// Mock data
const mockLists: List[] = [
  {
    id: "1",
    name: "Places to Eat",
    itemCount: 5,
    icon: "🍕",
    lastModified: new Date(2023, 4, 15)
  },
  {
    id: "2",
    name: "Hikes to Do",
    itemCount: 3,
    icon: "🥾",
    lastModified: new Date(2023, 5, 2)
  }
];

const mockItems: Record<string, ListItem[]> = {
  "1": [
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
      id: "104",
      title: "Taco Tuesday",
      tags: [{ id: "6", name: "Mexican" }],
      location: "South Side",
      completed: true,
      createdAt: new Date(2023, 4, 5)
    }
  ],
  "2": [
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
  ]
};

const ListDetailPage = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  
  const [list, setList] = useState<List | undefined>(undefined);
  const [items, setItems] = useState<ListItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ListItem[]>([]);
  const [activeItems, setActiveItems] = useState<ListItem[]>([]);
  const [completedItems, setCompletedItems] = useState<ListItem[]>([]);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  
  useEffect(() => {
    if (!listId) return;
    
    // Find the list in mock data
    const foundList = mockLists.find(l => l.id === listId);
    if (foundList) {
      setList(foundList);
      
      // Load list items
      const listItems = mockItems[listId] || [];
      setItems(listItems);
      setFilteredItems(listItems);
      
      // Separate active and completed items
      setActiveItems(listItems.filter(item => !item.completed));
      setCompletedItems(listItems.filter(item => item.completed));
    } else {
      // List not found, go back to lists
      navigate("/lists");
    }
  }, [listId, navigate]);
  
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
    // In a real app, delete from API
    navigate("/lists");
  };
  
  const handleToggleComplete = (itemId: string) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    
    setItems(updatedItems);
    setFilteredItems(updatedItems);
    setActiveItems(updatedItems.filter(item => !item.completed));
    setCompletedItems(updatedItems.filter(item => item.completed));
  };
  
  const handleSaveItem = (newItem: Partial<ListItem>) => {
    // Create or update item
    if (!listId) return;
    
    const isNewItem = !newItem.id;
    let updatedItems;
    
    if (isNewItem) {
      const item: ListItem = {
        id: Date.now().toString(),
        title: newItem.title || "",
        url: newItem.url,
        description: newItem.description,
        tags: newItem.tags || [],
        location: newItem.location,
        completed: false,
        createdAt: new Date(),
      };
      
      updatedItems = [item, ...items];
    } else {
      updatedItems = items.map(item => 
        item.id === newItem.id ? { ...item, ...newItem } : item
      );
    }
    
    setItems(updatedItems);
    setFilteredItems(updatedItems);
    setActiveItems(updatedItems.filter(item => !item.completed));
    setCompletedItems(updatedItems.filter(item => item.completed));
  };
  
  return (
    <div className="pb-16 h-screen bg-gray-50">
      <div className="px-4 pt-4 pb-2 bg-white fixed top-0 left-0 right-0 z-40 shadow-sm">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => navigate("/lists")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold flex-1 text-left">
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
                className="text-red-500"
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
                onClick={() => {}}
                onToggleComplete={() => handleToggleComplete(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No active items</p>
          </div>
        )}
        
        {completedItems.length > 0 && (
          <div className="mt-6">
            <div 
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              <h2 className="text-lg font-medium text-gray-500">
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
                    onClick={() => {}}
                    onToggleComplete={() => handleToggleComplete(item.id)}
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
            <AlertDialogAction onClick={handleDeleteList} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListDetailPage;
