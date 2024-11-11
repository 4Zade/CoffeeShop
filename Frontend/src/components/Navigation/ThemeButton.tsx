import { useTheme } from "../../contexts/ThemeContext"
import { Icon } from "@iconify/react/dist/iconify.js";

export default function ThemeButton() {
    const { theme, toggleTheme } = useTheme();

    const icon: string = theme === "light" ? "tabler:sun" : "tabler:moon";

    return (
        <button onClick={toggleTheme} className="w-10 h-10 grid place-items-center">
            <Icon icon={icon} className="w-8 h-8 text-[#ccc5c3] dark:text-[#66564c] active:scale-75 transition-[transform,color]"/>
        </button>
    )
}