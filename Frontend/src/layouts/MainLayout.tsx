import { Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useAlert } from "../contexts/AlertContext";
import Navbar from "../components/Navigation/Navbar";
import OverlayLayout from "./OverlayLayout";

export default function MainLayout() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme } = useTheme();
    const { modal } = useAlert();

    if (user && !user?.roles.includes('user')) {
        navigate('/verify');
    }

    return (
        <div className={`w-screen min-h-screen ${theme} flex`}>
            <div className="z-10">
                <OverlayLayout />
            </div>

            <main className={`
                    w-full h-auto flex flex-col z-0 ${modal && "overflow-hidden"}
                    bg-gradient-to-br  dark:to-[#221518] dark:from-[#5a4842] to-[#f1e2d2] from-slate-100 transition-[background]
                `}>
                <Navbar />
                <main className="w-full grow flex flex-col mt-32">
                    <Outlet />
                </main>
            </main>
        </div>
    )
}

// 