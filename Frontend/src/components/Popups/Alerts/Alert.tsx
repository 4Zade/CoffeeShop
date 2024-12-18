import { motion } from "framer-motion"

interface AlertProps {
    type: string;
    message: string | undefined;
}

export default function Alert({ type = "success", message = "Something happened successfully!"}: AlertProps) {
    return (
        <div
            className="bg-gradient-to-br from-[#C29469] via-[#ccc5c3] to-[#C29469] w-min h-min rounded-l-lg"
        >
            <div
                className="
                    rounded-l-lg p-0.5
                    bg-gradient-to-br from-transparent via-30% via-[#523428] to-[#523428]
                "
            >
                <div className="w-96 h-24 bg-[#523428] rounded-l-md flex flex-col overflow-hidden select-none">
                    <header className="flex flex-col w-full grow px-4 py-3 gap-1">
                        <h1 className="text-2xl font-bold text-white truncate">{type === "success" ? "Veiksmas sėkmingas" : "Klaida"}</h1>
                        <p className="text-slate-300 truncate">{message}</p>
                    </header>
                    
                    <motion.div 
                        className={`w-full h-2 ${type === "success" ? "bg-green-400" : "bg-red-400"}`}
                    >

                    </motion.div>
                </div>
            </div>
        </div>
    )
}