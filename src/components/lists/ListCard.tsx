
import { Card } from "@/components/ui/card";
import { List } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface ListCardProps {
  list: List;
  onClick: () => void;
}

const ListCard = ({ list, onClick }: ListCardProps) => {
  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow mb-3 animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-ios-blue/10 flex items-center justify-center text-ios-blue text-xl font-bold">
            {list.icon || list.name.charAt(0)}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-lg">{list.name}</h3>
            <p className="text-sm text-gray-500">{list.itemCount} items</p>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {formatDistanceToNow(list.lastModified, { addSuffix: true })}
        </div>
      </div>
    </Card>
  );
};

export default ListCard;
