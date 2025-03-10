import BottomNavbar from "@/components/custom/navbar/bottomNavbar";
import TopNavbar from "@/components/custom/navbar/topNavbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return(
        <div className="h-screen grid grid-rows-[7.8125vh_84.375vh_7.8125vh] font-satoshi">
            <div className="top-navbar drop-shadow-md relative z-50">
                <TopNavbar />
            </div>
            <div className="main-content bg-slate-200/70">
                <ScrollArea className="h-full">
                    <Outlet />
                </ScrollArea>
            </div>
            <div className="bottom-navbar drop-shadow-md">
                <BottomNavbar />
            </div>
        </div>
    )
};

export default Layout;