import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

interface ProtectedRoutesProps {
    children: React.ReactNode;
}

const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
    // const router = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = Cookies.get("token");
            
            if (!token) {
                window.location.pathname = '/login'
                return;
            }

            if (!token.startsWith("")) {
                Cookies.remove("token");
                window.location.pathname = '/login'
                return;
            }

            setIsAuthenticated(true);
            setIsLoading(false);
        };

        checkAuth();
    }, [location]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoutes;