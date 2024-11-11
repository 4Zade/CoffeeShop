import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import AuthFormSelector from "./AuthFormSelector";
import CloseButton from "../CloseButton";
import LoginForm from "../../Forms/LoginForm";
import RegistrationForm from "../../Forms/RegisterForm";

export default function AuthMenu() {
    const { open, form } = useAuth();

    return (
        <motion.main 
            className="
                h-screen w-96rounded-l-lg origin-right fixed top-0 right-0 z-40 flex flex-col items-end gap-4 pl-1
                bg-gradient-to-br dark:from-[#5a4842] dark:to-[#221518] from-[#EFD8BF] to-[#a99270] transition-[background]
            "
            initial={{ scaleX: 0 }}
            animate={{ scaleX: open ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div
                className="
                    w-full h-full flex flex-col items-end gap-4 p-4
                    bg-gradient-to-br dark:to-[#5a4842] dark:from-[#221518] to-[#EFD8BF] from-[#e9d8bf] transition-[background]
                "
            >
                <CloseButton/>
                <AuthFormSelector />

                {
                    form === 'login' ?
                        <LoginForm/>
                        :
                        <RegistrationForm/>
                }
            </div>
        </motion.main>
    )
}