import AlertCenter from "../components/Popups/AlertCenter"
import ModalCenter from "../components/Popups/ModalCenter"
import AuthMenu from "../components/Menus/Auth/AuthMenu"
import Menu from "../components/Menus/Menu/Menu"

export default function OverlayLayout() {
    return (
        <>
            <AlertCenter />
            <ModalCenter />

            <AuthMenu />
            <Menu/>
        </>
    )
}