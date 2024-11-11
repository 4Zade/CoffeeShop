import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

interface DropdownItemProps {
    children: React.ReactNode;
    icon?: string;
    link?: string;
    highlight?: boolean;
    onClick?: () => void;
}

export default function DropdownItem({ children, icon, link, onClick }: DropdownItemProps) {
    return link ? (
        <li 
            className="list-none whitespace-nowrap py-1 px-2 rounded-md cursor-pointer select-none
                dark:hover:bg-[#66564c] hover:bg-[#F2CEA9]
            "
            onClick={onClick}
        >
            <Link to={link}>
                <span className="
                    bg-clip-text text-transparent font-semibold text-lg flex items-center gap-2
                    bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                    
                ">
                    {
                        icon && <Icon icon={icon} className="w-6 h-6 transition-colors dark:text-[#ccc5c3] text-[#66564c]"/>
                    }
                    {children}
                </span>
            </Link>
        </li>
    )
    :
    (
        <li 
            className="list-none whitespace-nowrap py-1 px-2 rounded-md cursor-pointer select-none
                dark:hover:bg-[#66564c] hover:bg-[#F2CEA9]
            "
            onClick={onClick}
        >
            <span className="
                bg-clip-text text-transparent font-semibold text-lg flex items-center gap-2
                bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                
            ">
                {
                    icon && <Icon icon={icon} className="w-6 h-6 transition-colors dark:text-[#ccc5c3] text-[#66564c]"/>
                }
                {children}
            </span>
        </li>
    )
}