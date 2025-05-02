
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tag as TagType } from "@/lib/types";
import { useNavigate } from "react-router-dom";

interface TagBadgeProps {
  tag: TagType | string;
  onClick?: () => void;
  className?: string;
  navigateOnClick?: boolean;
}

const TagBadge = ({ tag, onClick, className, navigateOnClick = false }: TagBadgeProps) => {
  const navigate = useNavigate();
  const tagName = typeof tag === "string" ? tag : tag.name;
  const tagId = typeof tag === "string" ? tag : tag.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else if (navigateOnClick && typeof tag !== "string") {
      navigate(`/tags/${tagId}`);
    }
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        "bg-ios-lightBlue/10 text-ios-blue hover:bg-ios-lightBlue/20 cursor-pointer border-none dark:bg-ios-lightBlue/20 dark:text-ios-lightBlue dark:hover:bg-ios-lightBlue/30",
        className
      )}
      onClick={handleClick}
    >
      {tagName}
    </Badge>
  );
};

export default TagBadge;
