
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ListItem, Tag } from "@/lib/types";
import TabBar from "@/components/layout/TabBar";
import ListItemCard from "@/components/lists/ListItemCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Mock data - in a real app this would come from a database
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

const TagItemsPage = () => {
  const { tagId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<ListItem[]>([]);
  const [tag, setTag] = useState<Tag | null>(null);

  useEffect(() => {
    // In a real app, fetch items by tag ID from an API
    if (tagId) {
      const filteredItems = allMockItems.filter(item =>
        item.tags.some(tag => tag.id === tagId)
      );
      setItems(filteredItems);
      
      // Find the tag name
      if (filteredItems.length > 0) {
        const matchingTag = filteredItems[0].tags.find(t => t.id === tagId);
        if (matchingTag) {
          setTag(matchingTag);
        }
      }
    }
  }, [tagId]);

  // Add handler for toggling completion status
  const handleToggleComplete = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  // Add handler for deleting items
  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  return (
    <div className="pb-16 h-screen bg-gray-50">
      <div className="px-4 pt-4 pb-2 bg-white fixed top-0 left-0 right-0 z-40 shadow-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-2 -ml-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {tag ? `#${tag.name}` : 'Tag Items'}
        </h1>
        <p className="text-sm text-gray-500 mb-2">
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
                onClick={() => {}}
                onToggleComplete={() => handleToggleComplete(item.id)}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No items found with this tag</p>
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
};

export default TagItemsPage;
