
import { List, Tag, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const TabBar = () => {
  const location = useLocation();
  
  const tabs = [
    { icon: List, label: "Lists", path: "/lists" },
    { icon: Tag, label: "Tags", path: "/tags" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white flex justify-between items-center px-2 py-1 z-50">
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.path);
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-4 text-xs",
              isActive ? "text-ios-blue" : "text-gray-500"
            )}
          >
            <tab.icon className={cn("w-6 h-6 mb-1", isActive ? "text-ios-blue" : "text-gray-500")} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default TabBar;
