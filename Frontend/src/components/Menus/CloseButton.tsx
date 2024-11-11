import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from "../../contexts/AuthContext";

export default function CloseButton() {
    const { toggle } = useAuth();

    return (
        <button className="w-8 h-8" onClick={toggle}>
            <Icon icon="tabler:x" className="w-full h-full text-white"/>
        </button>
    )
}