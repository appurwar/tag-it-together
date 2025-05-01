
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

const FloatingActionButton = ({ onClick, className }: FloatingActionButtonProps) => {
  return (
    <Button
      className={cn(
        "fixed bottom-20 right-6 rounded-full w-14 h-14 shadow-lg bg-ios-blue hover:bg-ios-lightBlue flex items-center justify-center p-0 z-50 animate-scale-in",
        className
      )}
      onClick={onClick}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default FloatingActionButton;
