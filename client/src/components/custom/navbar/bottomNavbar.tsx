import { ChatIcon, CommunityIcon, HomeIcon, NotificationIcon, PuzzleIcon } from "@/components/icons/icons"
import { Link, useLocation } from "react-router-dom";
import { JSX } from "react";

interface NavItems {
    icon: JSX.Element;
    path: string;
    label: string;
}

const BottomNavbar = () => {
    
    const location = useLocation();
    const pathSegments = location.pathname.split("/"); 
    console.log(pathSegments);
    const lastSegment = pathSegments[pathSegments.length - 1];
    console.log(lastSegment);
    const navItems: NavItems[] = [
        {
            path: '/',
            icon: <HomeIcon />,
            label: 'Home'
        },
        {
            path: '/forum',
            icon: <CommunityIcon />,
            label: 'Forum'
        },
        {
            path: '/project',
            icon: <PuzzleIcon />,
            label: 'Project'
        },
        {
            path: '/chat',
            icon: <ChatIcon />,
            label: 'Chat'
        },
        {
            path: '/inbox',
            icon: <NotificationIcon />,
            label: 'Inbox'
        }
    ]
    return(
        <div className="h-full w-full flex justify-evenly items-center mx-auto font-satoshi">
            {
                navItems.map((navItem, index) => (
                    <Link className={`flex flex-col items-center font-semibold p-1 rounded-2xl ${lastSegment == navItem.label.toLowerCase() ? 'bg-gray-300' : 'bg-transparent text-black'} hover:bg-primary hover:text-white`} to={navItem.path} key={index}>
                        <div>
                            {navItem.icon}
                        </div>
                        <div>
                            {navItem.label}
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default BottomNavbar;