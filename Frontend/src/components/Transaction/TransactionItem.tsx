import { useEffect, useState } from "react";
import axios from "axios";

interface ProductProps {
    id: number;
    name: string;
    price: { $numberDecimal: string };
    category: string;
    image: string;
}

export default function TransactionItem({ id, quantity }: { id: number, quantity: number }) {
    const [product, setProduct] = useState<ProductProps | undefined>(undefined);

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

    return (
        <div className="w-full h-min flex items-center justify-between bg-gradient-to-r from-[#C29469] to-transparent dark:from-[#523428] dark:to-transparent pr-4 rounded-xl">
            <section className="p-2 flex gap-4">
                <div className="aspect-square bg-slate-200 dark:bg-[#3d292e] w-16 rounded-lg">
                    <img src="/jacobs.webp" alt="" draggable="false" className="w-full h-full object-contain"/>
                </div>

                <header className="flex flex-col justify-center">
                    <h1 className="font-semibold dark:text-white">{product?.name}</h1>
                    <h1 className="font-bold text-lg dark:text-white">{product?.price.$numberDecimal}€</h1>
                </header>
            </section>

            <section className="p-2 gap-4 flex items-center">
                <aside className="flex items-center gap-8">
                    <h1 className="font-bold dark:text-white">{product?.category}</h1>
                    <h1 className="font-bold dark:text-white">{quantity}</h1>
                    <h1 className="dark:text-white font-bold text-xl">{parseFloat(product?.price.$numberDecimal as string) * quantity}€</h1>
                </aside>
            </section>
        </div>
    )
}