import { HamIcon, NotificationIcon } from "@/components/icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";

const TopNavbar = () => {
    return (
        <div className="h-full w-full grid grid-cols-[50px_auto_50px] items-center">
            <div>
                <Sidebar />
            </div>
            <div className="flex items-center">
                <p className="ml-2 text-xl font-bold">Campus <span className="text-blue-500">Connect</span></p>
            </div>
            <div className="flex items-center space-x-2 justify-end">
                <Button className="bg-transparent text-foreground hover:bg-transparent flex items-center justify-center">
                    <NotificationIcon />
                </Button>
                <Button className="w-[50px] h-[50px] bg-transparent text-transparent hover:bg-transparent">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Button>
            </div>
        </div>
    )
}

export default TopNavbar;