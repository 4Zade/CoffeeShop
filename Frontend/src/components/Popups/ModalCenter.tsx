import { AnimatePresence, motion } from "framer-motion";
import { useAlert } from "../../contexts/AlertContext";
import AdminModal from "./Modals/Admin/AdminModal";
import DiscountModal from "./Modals/Discount/DiscountModal";
import ProductModal from "./Modals/Product/ProductModal";

export default function ModalCenter() {
    const { modal, closeModal } = useAlert();

    return modal && (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <main 
                        className="w-screen h-screen bg-zinc-950 bg-opacity-40 grid place-items-center absolute top-0 left-0 px-8 py-24 z-40"
                        onClick={closeModal}
                    >
                        {
                            modal === 'admin' &&
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key="admin"
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    exit={{ scaleY: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full"
                                >
                                    <AdminModal/>
                                </motion.div>
                            </AnimatePresence>
                        }
                        {
                            modal === 'discount' &&
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key="discount"
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    exit={{ scaleY: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full"
                                >
                                    <DiscountModal/>
                                </motion.div>
                            </AnimatePresence>
                        }
                        {
                            modal === 'product' && (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key="product"
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        exit={{ scaleY: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="h-full"
                                    >
                                        <ProductModal />
                                    </motion.div>
                                </AnimatePresence>
                            )
                        }
                    </main>
                </motion.div>
            </AnimatePresence>
    )
}