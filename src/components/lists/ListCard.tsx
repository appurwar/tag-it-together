
import { Card } from "@/components/ui/card";
import { List } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger 
} from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface ListCardProps {
  list: List;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ListCard = ({ list, onClick, onEdit, onDelete }: ListCardProps) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition 
  } = useSortable({ id: list.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
          <Card 
            className="h-40 flex flex-col p-4 cursor-pointer hover:shadow-md transition-shadow animate-fade-in bg-white dark:bg-gray-800"
            onClick={onClick}
          >
            {list.previewImage ? (
              <div className="h-20 w-full rounded-md overflow-hidden mb-2">
                <img 
                  src={list.previewImage} 
                  alt={list.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex items-start justify-between w-full">
                <div className="h-10 w-10 rounded-full bg-ios-blue/10 flex items-center justify-center text-ios-blue text-xl font-bold dark:bg-ios-blue/20">
                  {list.icon || list.name.charAt(0)}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
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
            )}

            <div className="mt-2 flex-grow">
              <h3 className="font-semibold text-base text-gray-800 dark:text-gray-100">{list.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{list.itemCount} items</p>
            </div>
            
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-auto">
              {formatDistanceToNow(list.lastModified, { addSuffix: true })}
            </div>
          </Card>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onEdit}>Edit</ContextMenuItem>
        <ContextMenuItem className="text-red-500 dark:text-red-400" onClick={onDelete}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ListCard;
