
import { Card } from "@/components/ui/card";
import { ListItem } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import TagBadge from "@/components/tags/TagBadge";
import { MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger 
} from "@/components/ui/context-menu";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ListItemCardProps {
  item: ListItem;
  onClick: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
}

const ListItemCard = ({ item, onClick, onToggleComplete, onDelete }: ListItemCardProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow mb-3 animate-fade-in bg-white dark:bg-gray-800">
          <div className="flex items-start">
            <div className="mt-1 mr-3">
              <Checkbox 
                checked={item.completed} 
                onCheckedChange={() => onToggleComplete()}
                className="border-ios-blue"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 
                  className={`font-medium text-base dark:text-gray-200 ${item.completed ? "line-through text-gray-400 dark:text-gray-500" : ""}`}
                  onClick={onClick}
                >
                  {item.title}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onClick(); }}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-500 dark:text-red-400"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div onClick={onClick}>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{item.description}</p>
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
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">📍 {item.location}</div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1" onClick={e => e.stopPropagation()}>
                {item.tags.map((tag) => (
                  <TagBadge key={tag.id} tag={tag} navigateOnClick={true} />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onClick}>Edit</ContextMenuItem>
        <ContextMenuItem onClick={onToggleComplete}>
          {item.completed ? "Mark as Active" : "Mark as Complete"}
        </ContextMenuItem>
        <ContextMenuItem className="text-red-500 dark:text-red-400" onClick={onDelete}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ListItemCard;
