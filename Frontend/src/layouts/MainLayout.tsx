import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navigation/Navbar";

export default function MainLayout() {
    const { theme } = useTheme();
    const { auth } = useAuth();
    const [open] = useState(false);

    return (
        <div className={`w-screen h-screen ${theme} flex`}>
            <main className={`h-full bg-slate-100 dark:bg-zinc-700 flex flex-col ${open && !auth ? "w-10/12 rounded-r-3xl" : "w-full"}`}>
                <Navbar />
                <main className="w-full grow">
                    <Outlet />
                </main>
            </main>
        </div>
    )
}