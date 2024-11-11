import { motion } from "framer-motion"
import { useAuth } from "../../../contexts/AuthContext"

export default function AuthFormSelector() {
    const { form, changeForm } = useAuth();

    return (
        <section className="w-full h-10 flex items-center">
                <div className="bg-slate-300 dark:bg-zinc-900 bg-opacity-50 dark:bg-opacity-50 w-full h-full grid grid-cols-2 rounded-lg overflow-hidden relative">
                    <motion.div 
                        className="w-1/2 h-full bg-violet-500 absolute top-0 left-0 z-0"
                        animate={ form === 'login' ? { x: 0 } : { x: '100%' } }
                    ></motion.div>

                    <button 
                        className="w-full h-full text-white z-10"
                        onClick={() => changeForm('login')}
                    >
                        Login
                    </button>
                    
                    <button 
                        className="w-full h-full text-white z-10"
                        onClick={() => changeForm('register')}
                    >
                        Register
                    </button>
                </div>
            </section>
    )
}