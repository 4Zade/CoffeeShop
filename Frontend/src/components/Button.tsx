import { ReactNode } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";

interface ButtonProps {
    onClick?: () => void;
    children?: ReactNode;
    icon?: string;
    color?: string;
    type?: "default" | "icon" | "width" | "submit";
}

export default function Button({ onClick, children, icon, type}: ButtonProps) {

    return (
        <motion.button 
            type={type === "submit" ? "submit" : "button"}
            className={`
                ${type === "width" || type === "submit" ? "w-full" : "w-min"} h-min rounded-full p-0.5 cursor-pointer whitespace-nowrap
                bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
            `}
            whileTap={{ scale: 0.9 }}
        >
            <div
                onClick={onClick}
                className={`
                    h-min py-2 flex gap-2 rounded-full items-center shadow-md dark:text-white transition-colors justify-center
                    dark:bg-[#3b2d2b] dark:hover:bg-[#66564c] hover:bg-[#F2CEA9] bg-[#EFD8BF]
                    ${type === "icon" ? "px-2" : "px-6"} ${type === "width" || type === "submit" ? "w-full" : "w-min"}
                `}
            >
                <span className="
                        flex items-center gap-2 bg-clip-text text-transparent font-semibold
                        bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                ">
                    {icon && <Icon icon={icon} className="w-6 h-6 dark:text-[#ccc5c3] text-[#66564c]"/>}
                    {children}
                </span>
            </div>
        </motion.button>
    )
}