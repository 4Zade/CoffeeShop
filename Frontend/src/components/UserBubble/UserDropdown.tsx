import { Icon } from "@iconify/react"
import Switch from "../Switch";
import { useTheme } from "../../contexts/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import UserDropdownItem from "./UserDropdownItem";

interface UserDropdownProps {
    open: boolean
    toggle: () => void
    roles: string[]
}

export default function UserDropdown({ open, toggle, roles }: UserDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { theme, toggleTheme = () => {} } = useTheme();
    const [openTheme, setOpenTheme] = useState(false);

    useEffect(() => {
        if (theme === "dark") {
            setOpenTheme(true);
        }
        else {
            setOpenTheme(false);
        }
    }, [theme]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                console.log("Clicked outside dropdown");
                toggle();
            }
        }

        if (open) {
            document.addEventListener("pointerdown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, [open, toggle]);

    const dropdownItems = [
        {
            type: "link",
            link: "/settings",
            text: "User settings",
            Side: () => <Icon icon="tabler:user" className="w-6 h-6"/>,
        },
        {
            type: "button",
            text: "Theme",
            Side: () => <Switch open={openTheme}/>,
            click: toggleTheme,
        },
        { divider: true },
        ...(roles.includes("Admin") ? [{
            type: "button",
            text: "Manage Administrators",
            Side: () => <Icon icon="tabler:settings" className="w-6 h-6"/>,
        }] : []),
        // Only show "Manage Discounts" if "admin" role is present
        ...(roles.includes("Admin") ? [{
            type: "button",
            text: "Manage Discounts",
            Side: () => <Icon icon="tabler:rosette-discount" className="w-6 h-6"/>,
        }] : []),
        ...(roles.includes("Admin") ? [{
            divider: true  
        }] : []),
        {
            type: "logout",
            text: "Logout",
            Side: () => <Icon icon="tabler:logout" className="w-6 h-6"/>
        }
    ];

    if (open) {
        return (
            <motion.div 
                ref={dropdownRef}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`z-50 w-min text-base px-2 py-2 rounded-lg dark:bg-zinc-800 select-none origin-top dark:text-white bg-slate-200 text-black whitespace-nowrap flex flex-col gap-1 text-center transition-colors absolute top-14 right-2`}
            >
                {dropdownItems.map((item, index) => (
                    item.divider ? <hr key={index} className="dark:bg-slate-300 bg-zinc-500 h-px border-0 rounded-full"/> : (
                        <UserDropdownItem
                            key={index}
                            type={item.type}
                            link={item.link}
                            text={item.text}
                            Side={item.Side}
                            click={item.click}
                        />
                    )
                ))}
            </motion.div>
        )
    }

    return null;
}
