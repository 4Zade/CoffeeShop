import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";

export default function ProtectedLayout() {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) {
        navigate('/login');
      }
    
    return <Outlet />;
}