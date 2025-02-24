import { ChatIcon, CommunityIcon, HomeIcon, NotificationIcon, PuzzleIcon } from "@/components/icons/icons"
import { Link } from "react-router-dom";

interface NavItems {
    icon: JSX.Element;
    path: string;
    label: string;
}

const BottomNavbar = () => {
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
        <div className="h-full w-full flex justify-evenly items-center mx-auto">
            {
                navItems.map((navItem, index) => (
                    <Link className="flex flex-col items-center" to={navItem.path} key={index}>
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