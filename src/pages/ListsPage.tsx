
import { useState } from "react";
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
  },
  {
    id: "3",
    name: "Books to Read",
    itemCount: 12,
    icon: "📚",
    lastModified: new Date(2023, 4, 28)
  },
  {
    id: "4",
    name: "Movies to Watch",
    itemCount: 8,
    icon: "🎬",
    lastModified: new Date(2023, 5, 1)
  }
];

const ListsPage = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState<List[]>(mockLists);
  const [filteredLists, setFilteredLists] = useState<List[]>(mockLists);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("lastModified");

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
  };

  return (
    <div className="pb-16 h-screen bg-gray-50">
      <div className="px-4 pt-4 pb-2 bg-white fixed top-0 left-0 right-0 z-40 shadow-sm">
        <SearchInput onSearch={handleSearch} placeholder="Search lists..." />
      </div>

      <div className="mt-16 px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Lists</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                Sort
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className={sortOption === "alphabetical" ? "bg-gray-100" : ""}
                onClick={() => handleSort("alphabetical")}
              >
                Alphabetical
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={sortOption === "lastModified" ? "bg-gray-100" : ""}
                onClick={() => handleSort("lastModified")}
              >
                Last Modified
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={sortOption === "custom" ? "bg-gray-100" : ""}
                onClick={() => handleSort("custom")}
              >
                Custom Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          {filteredLists.length > 0 ? (
            filteredLists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                onClick={() => navigate(`/lists/${list.id}`)}
              />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No lists found</p>
            </div>
          )}
        </div>
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
    </div>
  );
};

export default ListsPage;
