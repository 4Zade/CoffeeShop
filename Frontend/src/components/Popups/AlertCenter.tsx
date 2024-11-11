import { motion, AnimatePresence } from "framer-motion"
import { useAlert } from "../../contexts/AlertContext"
import Alert from "./Alerts/Alert";

export default function AlertCenter() {
    const { alert } = useAlert();

    return (
        <main className="w-screen h-screen fixed top-0 left-0 z-50 pointer-events-none flex justify-end py-20">
            {
                (alert.success || alert.error) && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={alert.success ? `success-${alert.success.message}` : `error-${alert.error?.message}`} 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <Alert type={alert.success ? "success" : "error"} message={alert.success ? alert.success.message : alert.error?.message ? alert.error.message : "An error has occurred"}/>
                        </motion.div>
                    </AnimatePresence>
                )
            }
        </main>
    )
}