import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface CategoryItemProps {
    category: string;
    icon: string;
}

export default function CategoryItem({ category, icon }: CategoryItemProps) {
    const [linkCategory, setLinkCategory] = useState("");

    useEffect(() => {
        if (category === "Visos kavos") {
           return setLinkCategory("/produktai");
        }

        setLinkCategory(`/produktai/${category
            .split(" ")
            .join("-")
            .toLowerCase()
                .replace(/ą/g, "a")
                .replace(/č/g, "c")
                .replace(/ę/g, "e")
                .replace(/ė/g, "e")
                .replace(/į/g, "i")
                .replace(/š/g, "s")
                .replace(/ų/g, "u")
                .replace(/ū/g, "u")
                .replace(/ž/g, "z")
        }`);
    }, [category]);

    return (
        <Link to={linkCategory} className="flex flex-col">
            <header
                className="
                    flex items-center gap-2 text-lg font-bold text-transparent bg-clip-text whitespace-nowrap
                    bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                "
            >
                <Icon icon={icon} className="w-6 h-6 dark:text-[#ccc5c3] text-[#66564c]"/>
                {category}
            </header>
        </Link>
    )
}