import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from "../../contexts/AuthContext";

export default function AddProductButton() {
    const { user } = useAuth();

    return user?.roles.includes("admin") && (
        <button 
            className="
                w-full h-full rounded-xl p-1 cursor-pointer group/add-product active:scale-95 transition-[transform,background]
                 bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
            "
        >
            <div 
                className="
                    w-full h-full grid place-items-center rounded-lg
                    dark:bg-[#3b2d2b] dark:hover:bg-[#66564c] hover:bg-[#F2CEA9] bg-[#EFD8BF]
                "
            >
                <Icon icon="tabler:plus" className="w-12 h-12 dark:text-[#ccc5c3] text-[#66564c] group-hover/add-product:scale-125 transition-[transform,color]"/>
            </div>
        </button>
    )
}