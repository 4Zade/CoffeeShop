// CartItem.tsx
import { useEffect, useState } from "react";
import { useCart } from "../../../contexts/CartContext";
import axios from "axios";

// Define props types
export interface CartItemProps {
    productId: number;
    quantity: number;
    pricePerItem?: number;
    totalPrice: number;
}

interface ProductProps {
    name: string;
    image: string;
}

export default function CartItem({ productId, quantity, pricePerItem }: CartItemProps) {
    const [product, setProduct] = useState<ProductProps | undefined>(undefined);
    const [itemQuantity, setItemQuantity] = useState(quantity);
    const { updateItemQuantity, removeItemFromCart, getCart } = useCart();  // <-- added getCart

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:7000/api/v1/products/${productId}`);
                setProduct(response.data.data);
            } catch (err) {
                console.log("Error loading product:", err);
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId]);

    const handleQuantityChange = async (newQuantity: number) => {
        setItemQuantity(newQuantity);
        await updateItemQuantity(productId, newQuantity);
        await getCart();  // <-- Refresh cart to reflect updated totals in summary
    };

    return (
        <div className="flex items-center space-x-4 p-4 border-b">
            <img src={product?.image} alt={product?.name} className="w-16 h-16 object-cover" />
            <div className="flex-1">
                <h2 className="font-semibold text-lg">{product?.name}</h2>
                <p>Price per item: €{pricePerItem?.toFixed(2)}</p>
                <div className="flex items-center space-x-2 mt-2">
                    <button
                        onClick={() => handleQuantityChange(Math.max(1, itemQuantity - 1))}
                        className="bg-gray-300 px-2 rounded"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        value={itemQuantity}
                        onChange={(e) => handleQuantityChange(Number(e.target.value))}
                        className="w-16 text-center border rounded"
                        min={1}
                    />
                    <button
                        onClick={() => handleQuantityChange(itemQuantity + 1)}
                        className="bg-gray-300 px-2 rounded"
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="font-semibold">Total: €{(pricePerItem! * itemQuantity).toFixed(2)}</p>
                <button
                    onClick={() => removeItemFromCart(productId)}
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    Remove
                </button>
            </div>
        </div>
    );
}
