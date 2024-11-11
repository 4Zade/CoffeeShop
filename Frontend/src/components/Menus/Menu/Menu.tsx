import { motion, AnimatePresence } from "framer-motion"
import { useMenu } from "../../../contexts/MenuContext"
import ThemeButton from "../../Navigation/ThemeButton";
import CartButton from "../../Navigation/Cart/CartButton";
import UserBubble from "../../Navigation/User/UserBubble";
import NavLink from "../../Navigation/NavLink";

export default function Menu() {
    const { open } = useMenu();

    return (
        <AnimatePresence mode="wait">
            {
                open && (
                    <motion.main 
                        className="lg:hidden w-screen h-screen fixed top-0 left-0 z-40 flex justify-start items-end pointer-events-none"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <section className="w-[90%] h-5/6 bg-red-400 rounded-tr-xl p-2 pointer-events-auto flex flex-col">
                            <section className=" sm:hidden w-full flex items-center gap-4 justify-end">
                                <ThemeButton />
                                <CartButton />
                                <UserBubble />
                            </section>

                            <section className="w-full flex flex-col gap-4">
                                <NavLink to="/produktai">Mūsų kava</NavLink>
                                <NavLink to="/kontaktai">Kontaktai</NavLink>
                            </section>
                        </section>
                    </motion.main>
                )
            }
        </AnimatePresence>
    )
}