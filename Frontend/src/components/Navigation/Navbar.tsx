import UserBubble from "../UserBubble/UserBubble";
import CartButton from "../Cart/CartButton";
import NavLink from "./NavLink";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="w-full h-20 flex justify-between items-center pr-8 relative">
            <section className="flex items-center text-[#291E1E] dark:text-white text-xl font-black">
                <Link to="/" className="scale-[0.6] hover:rotate-[360deg] transition-transform duration-1000 ease-in-out">
                    <img src="/logo.webp" alt="" draggable="false"/>
                </Link>

                <div className="flex items-center gap-6">
                    <NavLink to="/products">Our Coffee</NavLink>
                    <NavLink to="/contacts">Contact Us</NavLink>
                </div>
            </section>

            <section className="flex items-center gap-4">
                <CartButton />
                <UserBubble roles={["User", "Admin"]}/>
            </section>
        </nav>
    )
}

// from-[#291E1E] to-[#5C4342]