import { ChatIcon, CommunityIcon, HomeIcon, PresentationIcon, PuzzleIcon } from "@/components/icons/icons"
import { Link, useLocation } from "react-router-dom";
import { JSX } from "react";

interface NavItems {
    icon: (props: { isSolid?: boolean }) => JSX.Element;
    path: string;
    label: string;
}

const BottomNavbar = () => {
    const location = useLocation();
    
    const navItems: NavItems[] = [
        {
            path: '/',
            icon: (props) => <HomeIcon {...props} />,
            label: 'Home'
        },
        {
            path: '/forum',
            icon: (props) => <CommunityIcon {...props} />,
            label: 'Forum'
        },
        {
            path: '/event',
            icon: (props) => <PresentationIcon {...props} />,
            label: 'Events'
        },
        {
            path: '/project',
            icon: (props) => <PuzzleIcon {...props} />,
            label: 'Project'
        },
        {
            path: '/chat',
            icon: (props) => <ChatIcon {...props} />,
            label: 'Chat'
        },
        // {
        //     path: '/inbox',
        //     icon: (props) => <NotificationIcon {...props} />,
        //     label: 'Inbox'
        // },
    ];

    return(
        <div className="h-full w-full flex justify-evenly items-center mx-auto font-satoshi">
            {
                navItems.map((navItem, index) => {
                    const isActive = navItem.path === location.pathname;
                    
                    return (
                        <Link 
                            className={`flex flex-col transition-all duration-200 items-center font-semibold p-1 rounded-2xl ${
                                isActive ? 'text-orange-500' : 'bg-transparent text-black'
                            } hover:bg-slate-50 h-[50px] w-[50px] drop-shadow-none hover:drop-shadow-none`} 
                            to={navItem.path} 
                            key={index}
                        >
                            <div>
                                {navItem.icon({ isSolid: isActive })}
                            </div>
                            <div className="text-xs">
                                {navItem.label}
                            </div>
                        </Link>
                    );
                })
            }
        </div>
    );
};

export default BottomNavbar;