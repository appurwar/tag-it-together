
import { useState } from "react";
import TabBar from "@/components/layout/TabBar";
import SearchInput from "@/components/shared/SearchInput";
import { Tag } from "@/lib/types";
import TagBadge from "@/components/tags/TagBadge";

// Mock data
const mockTags: Tag[] = [
  { id: "1", name: "Pizza", count: 3 },
  { id: "2", name: "Fast Food", count: 6 },
  { id: "3", name: "Japanese", count: 2 },
  { id: "4", name: "Sushi", count: 2 },
  { id: "5", name: "Burgers", count: 4 },
  { id: "6", name: "Mexican", count: 3 },
  { id: "7", name: "Mountains", count: 5 },
  { id: "8", name: "Moderate", count: 2 },
  { id: "9", name: "Fiction", count: 8 },
  { id: "10", name: "Sci-Fi", count: 4 },
  { id: "11", name: "Mystery", count: 5 },
  { id: "12", name: "Horror", count: 3 },
  { id: "13", name: "Comedy", count: 6 },
  { id: "14", name: "Action", count: 7 },
  { id: "15", name: "Thriller", count: 3 },
];

const TagsPage = () => {
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [filteredTags, setFilteredTags] = useState<Tag[]>(mockTags);

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

  // Group tags by first letter
  const groupedTags = filteredTags.reduce<Record<string, Tag[]>>((groups, tag) => {
    const firstLetter = tag.name.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(tag);
    return groups;
  }, {});

  const sortedGroups = Object.keys(groupedTags).sort();

  return (
    <div className="pb-16 h-screen bg-gray-50">
      <div className="px-4 pt-4 pb-2 bg-white fixed top-0 left-0 right-0 z-40 shadow-sm">
        <SearchInput onSearch={handleSearch} placeholder="Search tags..." />
      </div>

      <div className="mt-16 px-4">
        <h1 className="text-2xl font-bold mb-6">Tags</h1>

        {sortedGroups.length > 0 ? (
          sortedGroups.map(letter => (
            <div key={letter} className="mb-6">
              <h2 className="text-lg font-medium text-gray-500 mb-3">{letter}</h2>
              <div className="flex flex-wrap gap-2">
                {groupedTags[letter].map(tag => (
                  <div key={tag.id} className="flex items-center animate-fade-in">
                    <TagBadge 
                      tag={tag} 
                      className="text-sm py-1.5" 
                      onClick={() => {}}
                    />
                    <span className="ml-1 text-xs text-gray-500">
                      ({tag.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No tags found</p>
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
};

export default TagsPage;
