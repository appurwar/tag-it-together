
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tag as TagType } from "@/lib/types";

interface TagBadgeProps {
  tag: TagType | string;
  onClick?: () => void;
  className?: string;
}

const TagBadge = ({ tag, onClick, className }: TagBadgeProps) => {
  const tagName = typeof tag === "string" ? tag : tag.name;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "bg-ios-lightBlue/10 text-ios-blue border-none hover:bg-ios-lightBlue/20 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {tagName}
    </Badge>
  );
};

export default TagBadge;
