import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import axios from "axios";

interface ProductProps {
    id: number;
    name: string;
    price: { $numberDecimal: string };
    category: string;
    image: string;
}

export default function CartItem({ id, quantity }: { id: number, quantity: number }) {
    const [product, setProduct] = useState<ProductProps | undefined>(undefined);
    const { getCart } = useCart();

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response = await axios.get(`/api/v1/products/id/${id}`);
                setProduct(response.data.data);
            } catch (err) {
                console.log("Error loading product:", err);
            }
        };

        loadProduct();
    }, [id]);

    const deleteItemFromCart = async () => {
        try {
            await axios.delete(`/api/v1/users/cart/${id}`, { data: { purge: true }, withCredentials: true });
            await getCart();
        } catch (err) {
            console.log(err);
        }
    };

    const quantityChange = async (action: "add" | "remove") => {
        try {
           if (action === "add") {
               await axios.post(`api/v1/users/cart/${id}`, {}, { withCredentials: true });
           }
           else if (action === "remove") {
               await axios.delete(`/api/v1/users/cart/${id}`, { withCredentials: true });
           }
            await getCart();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="w-full h-min flex flex-wrap items-center justify-between bg-gradient-to-br lg:bg-gradient-to-r from-[#C29469] to-transparent dark:from-[#523428] dark:to-transparent pr-4 rounded-xl">
            <section className="p-2 flex gap-4">
                <div className="aspect-square bg-slate-200 dark:bg-[#3d292e] w-16 rounded-lg">
                    <img src={product?.image || "/jacobs.webp"} alt="" draggable="false" className="w-full h-full object-contain"/>
                </div>

                <header className="flex flex-col justify-center">
                    <h1 className="font-semibold dark:text-white">{product?.name}</h1>
                    <h1 className="font-bold text-lg dark:text-white">{product?.price.$numberDecimal}€</h1>
                </header>
            </section>

            <section className="p-2 gap-4 flex items-center">
                <aside className="flex items-center gap-8 flex-wrap justify-center">
                    <h1 className="font-bold dark:text-white">{product?.category}</h1>
                    <h1 className="dark:text-white font-bold text-xl">{parseFloat(product?.price.$numberDecimal as string) * quantity}€</h1>
                    <div className="flex items-center gap-4">
                        <button 
                            className="w-8 h-8 rounded-full grid place-items-center dark:text-slate-100 hover:bg-zinc-600 hover:bg-opacity-20"
                            onClick={() => quantityChange("remove")}
                        >
                            <Icon icon="tabler:minus" className="w-6 h-6"/>
                        </button>

                        <span className="font-bold dark:text-white">{quantity}</span>

                        <button 
                            className="w-8 h-8 rounded-full grid place-items-center dark:text-slate-100 hover:bg-zinc-600 hover:bg-opacity-20"
                            onClick={() => quantityChange("add")}
                        >
                            <Icon icon="tabler:plus" className="w-6 h-6"/>
                        </button>
                    </div>

                    <button 
                        className="w-8 h-8 rounded-full grid place-items-center dark:text-slate-100 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-600 hover:bg-opacity-20"
                        onClick={deleteItemFromCart}
                    >
                        <Icon icon="tabler:trash" className="w-6 h-6"/>
                    </button>
                </aside>
            </section>
        </div>
    )
}