import { motion } from "framer-motion"

interface AlertProps {
    type: string;
    message: string | undefined;
}

export default function Alert({ type = "success", message = "Something happened successfully!"}: AlertProps) {
    return (
        <div className="w-96 h-24 bg-slate-300 dark:bg-zinc-800 rounded-l-md flex flex-col overflow-hidden select-none">
            <header className="flex flex-col w-full grow px-4 py-3 gap-1">
                <h1 className="text-2xl font-bold dark:text-white truncate">{type}</h1>
                <p className="dark:text-slate-300 truncate">{message}</p>
            </header>
            
            <motion.div 
                className={`w-full h-2 ${type === "success" ? "bg-green-400" : "bg-red-400"}`}
            >

            </motion.div>
        </div>
    )
}