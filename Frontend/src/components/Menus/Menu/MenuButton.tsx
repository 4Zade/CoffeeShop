import { Icon } from "@iconify/react"
import { useMenu } from "../../../contexts/MenuContext"

export default function MenuButton() {
    const { toggle } = useMenu();

    return (
        <button className="w-10 h-10 grid place-items-center" onClick={toggle}>
            <Icon icon="tabler:menu-2" className="w-8 h-8 text-[#ccc5c3] dark:text-[#66564c] active:scale-75 transition-[transform,color]"/>
        </button>
    )
}