
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TabBar from "@/components/layout/TabBar";
import SearchInput from "@/components/shared/SearchInput";
import FloatingActionButton from "@/components/shared/FloatingActionButton";
import ListCard from "@/components/lists/ListCard";
import { List, SortOption } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSwappingStrategy } from "@dnd-kit/sortable";
import { toast } from "sonner";

// Mock data - updated with current dates
const mockLists: List[] = [
  {
    id: "1",
    name: "Places to Eat",
    itemCount: 5,
    icon: "🍕",
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: "2",
    name: "Hikes to Do", 
    itemCount: 3,
    icon: "🥾",
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: "3",
    name: "Books to Read",
    itemCount: 12,
    icon: "📚",
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    id: "4",
    name: "Movies to Watch",
    itemCount: 8,
    icon: "🎬",
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  }
];

const ListsPage = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState<List[]>(mockLists);
  const [filteredLists, setFilteredLists] = useState<List[]>(mockLists);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("lastModified");
  const [editingList, setEditingList] = useState<List | null>(null);
  const [isEditListOpen, setIsEditListOpen] = useState(false);
  const [isDeleteListConfirmOpen, setIsDeleteListConfirmOpen] = useState(false);

  // Configure dnd-kit sensors for drag and drop with a delay for long press
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250, // Long press delay in ms
        tolerance: 5, // Movement tolerance before canceling long press
      },
    })
  );

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredLists(lists);
      return;
    }

    const filtered = lists.filter(list => 
      list.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredLists(filtered);
  };

  const handleSort = (option: SortOption) => {
    setSortOption(option);
    let sorted = [...filteredLists];
    
    if (option === "alphabetical") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "lastModified") {
      sorted.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
    }
    
    setFilteredLists(sorted);
  };

  const handleAddList = () => {
    if (!newListName.trim()) return;
    
    const newList: List = {
      id: Date.now().toString(),
      name: newListName,
      itemCount: 0,
      lastModified: new Date()
    };
    
    const updatedLists = [newList, ...lists];
    setLists(updatedLists);
    setFilteredLists(updatedLists);
    setNewListName("");
    setIsAddListOpen(false);
    toast.success(`List "${newListName}" created successfully`);
  };

  const handleEditList = () => {
    if (!editingList || !editingList.name.trim()) return;

    const updatedLists = lists.map(list => 
      list.id === editingList.id 
        ? { ...list, name: editingList.name, lastModified: new Date() } 
        : list
    );

    setLists(updatedLists);
    setFilteredLists(updatedLists);
    setIsEditListOpen(false);
    setEditingList(null);
    toast.success("List updated successfully");
  };

  const handleDeleteList = () => {
    if (!editingList) return;

    const updatedLists = lists.filter(list => list.id !== editingList.id);
    setLists(updatedLists);
    setFilteredLists(updatedLists);
    setIsDeleteListConfirmOpen(false);
    setEditingList(null);
    toast.success(`"${editingList.name}" deleted`);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    const oldIndex = filteredLists.findIndex(list => list.id === active.id);
    const newIndex = filteredLists.findIndex(list => list.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(filteredLists, oldIndex, newIndex);
      setFilteredLists(reordered);
      
      // If we're in custom sort mode, update the main list array too
      if (sortOption === "custom") {
        const reorderedMain = arrayMove(lists, oldIndex, newIndex);
        setLists(reorderedMain);
      } else {
        // Auto-switch to custom sort when user manually rearranges
        setSortOption("custom");
      }
    }
  };

  return (
    <div className="pb-16 h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 pt-4 pb-2 bg-white dark:bg-gray-800 fixed top-0 left-0 right-0 z-40 shadow-sm">
        <div className="flex items-center justify-center mb-2">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">LinkNest</h1>
        </div>
        <SearchInput onSearch={handleSearch} placeholder="Search lists..." />
      </div>

      <div className="mt-16 px-4">
        <div className="flex items-center justify-between mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                Sort
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem 
                className={sortOption === "alphabetical" ? "bg-gray-100 dark:bg-gray-700" : ""}
                onClick={() => handleSort("alphabetical")}
              >
                Alphabetical
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={sortOption === "lastModified" ? "bg-gray-100 dark:bg-gray-700" : ""}
                onClick={() => handleSort("lastModified")}
              >
                Last Modified
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={sortOption === "custom" ? "bg-gray-100 dark:bg-gray-700" : ""}
                onClick={() => handleSort("custom")}
              >
                Custom Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DndContext 
          sensors={sensors} 
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredLists.map(list => list.id)} strategy={rectSwappingStrategy}>
            <div className="grid grid-cols-2 gap-3">
              {filteredLists.length > 0 ? (
                filteredLists.map((list) => (
                  <ListCard
                    key={list.id}
                    list={list}
                    onClick={() => navigate(`/lists/${list.id}`)}
                    onEdit={() => {
                      setEditingList(list);
                      setIsEditListOpen(true);
                    }}
                    onDelete={() => {
                      setEditingList(list);
                      setIsDeleteListConfirmOpen(true);
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 col-span-2">
                  <p>No lists found</p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <FloatingActionButton onClick={() => setIsAddListOpen(true)} />
      <TabBar />

      {/* Add List Dialog */}
      <Dialog open={isAddListOpen} onOpenChange={setIsAddListOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="listName">List Name</Label>
            <Input
              id="listName"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Enter list name"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddListOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddList}>Create List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit List Dialog */}
      <Dialog open={isEditListOpen} onOpenChange={setIsEditListOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit List</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="editListName">List Name</Label>
            <Input
              id="editListName"
              value={editingList?.name || ""}
              onChange={(e) => setEditingList(prev => prev ? {...prev, name: e.target.value} : null)}
              placeholder="Enter list name"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditListOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditList}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete List Confirmation Dialog */}
      <Dialog open={isDeleteListConfirmOpen} onOpenChange={setIsDeleteListConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete List</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete "{editingList?.name}"? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteListConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteList}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListsPage;
