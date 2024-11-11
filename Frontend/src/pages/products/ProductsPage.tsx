import ProductCard, { ProductProps } from "../../components/Products/ProductCard";
import { useLoaderData } from "react-router-dom";
import CategoryNav from "../../components/Products/CategoryNav";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../components/Button";
import { useEffect } from "react";
import { useProduct } from "../../contexts/ProductContext";
import { useAlert } from "../../contexts/AlertContext";
import { useAuth } from "../../contexts/AuthContext";

export default function ProductsPage() {
    const { products, setProducts } = useProduct();
    const { productModal } = useAlert();
    const { auth, checkAuth } = useAuth();
    const data: ProductProps[] = useLoaderData() as ProductProps[];

    useEffect(() => {
        checkAuth();
        setProducts(data);
    }, [data]);

    return (
        <main className="relative h-auto py-4 px-12 sm:px-16 md:px-20 lg:px-28 xl:px-32 2xl:px-48 flex flex-col gap-8 z-10">
            <h1 
                className="
                    text-5xl font-bold bg-clip-text text-transparent h-16 text-center relative
                    bg-gradient-to-br dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                "
            >
                Atrask mūsų kavą!
                {
                    auth && <div className="absolute w-min h-min text-base top-0 right-0">
                        <Button icon="tabler:plus" onClick={() => productModal("add")}>Pridėti prekę</Button>
                    </div>
                }
            </h1>

            <CategoryNav />

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5 auto-rows-auto place-items-center">
                <AnimatePresence mode="popLayout">
                    { 
                        products.map((product: ProductProps) => (
                            <motion.div
                                key={product.id}
                                className="w-full aspect-[6/8]"
                                // initial={{ scale: 0 }}
                                // animate={{ scale: 1 }}
                                // exit={{ scale: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ProductCard
                                    product={product}
                                />
                            </motion.div>
                        ))
                    }
                </AnimatePresence>
            </section>
            
        </main>
    );
}