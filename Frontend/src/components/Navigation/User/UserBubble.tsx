import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext"
import { useAlert } from "../../../contexts/AlertContext";
import Button from "../../Button";
import Dropdown from "../../Dropdown/Dropdown";
import DropdownItem from "../../Dropdown/DropdownItem";

interface DropdownDataProps {
    name: string,
    icon: string,
    link?: string,
    onClick?: () => void
}

export default function UserBubble() {
    const [open, setOpen] = useState<boolean>(false);
    const { auth, toggle, logout } = useAuth();
    const { adminModal, discountModal } = useAlert();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const dropdownData = [
        {
            name: "Nustatymai",
            icon: "tabler:settings",
            link: "/settings"
        },
        {
            name: "Valdyti administratorius",
            icon: "tabler:users",
            onClick: adminModal
        },
        {
            name: "Valdyti nuolaidas",
            icon: "tabler:discount",
            onClick: discountModal
        },
        {
            name: "Atsijungti",
            icon: "tabler:logout",
            highlight: true,
            onClick: logout
        }
    ]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close dropdown when an item is clicked
    const handleItemClick = (onClick?: () => void) => {
        if (onClick) onClick();
        setOpen(false);
    };

    return (
        <div className="relative overflow-visible z-30" ref={dropdownRef}>
            {
                auth ? 
                <Button icon="tabler:user" type="icon" onClick={() => setOpen(!open)}></Button>
                :
                <Button icon="tabler:user" onClick={toggle}>Prisijungti</Button>
            }
            {
                open && <Dropdown>
                {
                    dropdownData && dropdownData.map((item: DropdownDataProps, index: number) => (
                        <DropdownItem key={index} icon={item.icon} link={item.link} onClick={() => handleItemClick(item.onClick)}>
                            {item.name}
                        </DropdownItem>
                    ))
                }
                </Dropdown>
            }
        </div>
    )
}