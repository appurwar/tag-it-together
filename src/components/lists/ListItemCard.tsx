
import { Card } from "@/components/ui/card";
import { ListItem } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import TagBadge from "@/components/tags/TagBadge";
import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ListItemCardProps {
  item: ListItem;
  onClick: () => void;
  onToggleComplete: () => void;
}

const ListItemCard = ({ item, onClick, onToggleComplete }: ListItemCardProps) => {
  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow mb-3 animate-fade-in"
    >
      <div className="flex items-start">
        <div className="mt-1 mr-3">
          <Checkbox 
            checked={item.completed} 
            onCheckedChange={() => onToggleComplete()}
            className="border-ios-blue"
          />
        </div>
        <div className="flex-1" onClick={onClick}>
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-medium text-base ${item.completed ? "line-through text-gray-400" : ""}`}>
              {item.title}
            </h3>
            <div className="text-xs text-gray-400">
              {formatDistanceToNow(item.createdAt, { addSuffix: true })}
            </div>
          </div>
          
          {item.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
          )}
          
          {item.previewImage && (
            <div className="mb-3 rounded-md overflow-hidden h-40">
              <img 
                src={item.previewImage} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {item.location && (
            <div className="text-xs text-gray-500 mb-2">📍 {item.location}</div>
          )}
          
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ListItemCard;
