import CartButton from "./Cart/CartButton";
import NavLink from "./NavLink";
import { Link } from "react-router-dom";
import UserBubble from "./User/UserBubble";
import ThemeButton from "./ThemeButton";
import MenuButton from "../Menus/Menu/MenuButton";

export default function Navbar() {
    return (
        <nav className="w-full h-min flex flex-col absolute top-0 left-0">
            <section className="w-full h-8">

            </section>

            <nav 
                className="
                    w-full h-16
                    bg-gradient-to-br from-[#291E1E] to-[#5C4342] dark:from-[#ccc5c3] dark:to-[#ddcfa7]
                "
            >
                <div className="w-full h-full flex items-center justify-center relative">
                    <section className="absolute left-4 lg:hidden">
                        <MenuButton />
                    </section>

                    <section className="w-1/2 flex items-center justify-center text-[#291E1E] dark:text-white text-xl font-black relative gap-8">
                        <NavLink to="/produktai">Mūsų kava</NavLink>

                        <Link to="/" className="transition-transform duration-1000 ease-in-out">
                            <img src="/logo.webp" alt="" draggable="false"/>
                        </Link>

                        <NavLink to="/kontaktai">Kontaktai</NavLink>
                    </section>

                    <section className="absolute right-4 hidden sm:flex items-center gap-4">
                        <ThemeButton />
                        <CartButton />
                        <UserBubble />
                    </section>
                </div>
            </nav>
        </nav>
    )
}

// from-[#291E1E] to-[#5C4342]