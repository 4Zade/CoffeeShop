import UserDropdown from "./UserDropdown";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function UserBubble({ roles }: { roles: string[] }) {
    const [open, setOpen] = useState(false);
    const { auth, user } = useAuth();

    function handleClickOutside() {
        setTimeout(() => setOpen(false), 150);
    }

    // Render loading state, login button, or user dropdown
    return (
        <main className="relative w-min h-min group">
            {auth ? (
                <>
                    <div className="w-12 h-12 rounded-full border-2 border-coffee-400" onClick={() => setOpen(!open)}>
                        <img
                            src="https://i.pinimg.com/736x/dc/9c/61/dc9c614e3007080a5aff36aebb949474.jpg"
                            alt="User Avatar"
                            className="w-full h-full rounded-full aspect-square"
                        />
                    </div>
                    <UserDropdown open={open} toggle={handleClickOutside} roles={roles} />
                </>
            ) : (
                <div className="w-min h-min grid place-items-center">
                    <Link to="/login" className="px-6 py-2 text-base font-semibold text-coffee-400 bg-gradient-to-br from-coffee-200 to-coffee-100 rounded-md active:scale-90 hover:opacity-80 transition-[transform,opacity]">
                        Login
                    </Link>
                </div>
            )}

            
            {
            auth &&
            <div className="group-hover:block hidden absolute top-12 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white font-semibold text-xs rounded-md p-2 opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {user?.first_name} {user?.last_name}
            </div>
            }
        </main>
    );
}
