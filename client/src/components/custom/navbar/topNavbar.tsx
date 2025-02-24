import { useState } from "react"; // Import useState
import { NotificationIcon } from "@/components/icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate

const TopNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation

  const navItems = [
    {
      path: ["/", "/home", "/inbox"],
      label: "Connect",
    },
    {
      path: "/forum",
      label: "Forum",
    },
    {
      path: "/event",
      label: "Event",
    },
    {
      path: "/project",
      label: "Project",
    },
    {
      path: "/chat",
      label: "Chat",
    },
  ];

  const getCurrentLabel = () => {
    const currentItem = navItems.find((item) =>
      Array.isArray(item.path)
        ? item.path.includes(location.pathname)
        : item.path === location.pathname
    );
    return currentItem ? currentItem.label : "Connect";
  };

  return (
    <div className="h-full w-full grid grid-cols-[50px_auto_50px] items-center bg-black border-b border-white/20">
      <div>
        <Sidebar />
      </div>
      <div className="flex items-center">
        <p className="ml-2 text-xl font-bold text-white">
          Campus <span className="text-orange-500">{getCurrentLabel()}</span>
        </p>
      </div>
      <div className="flex items-center space-x-2 justify-end">
        <Link to={"/inbox"}>
          <Button
            variant={"ghost"}
            className="bg-transparent border-0 drop-shadow-none text-foreground hover:bg-transparent flex items-center justify-center"
          >
            <NotificationIcon />
          </Button>
        </Link>
        <Button
          variant={"ghost"}
          className="w-[50px] h-[50px] bg-transparent text-transparent hover:bg-transparent"
          onClick={() => navigate("/profile")} // Navigate to the profile page
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </div>
  );
};

export default TopNavbar;