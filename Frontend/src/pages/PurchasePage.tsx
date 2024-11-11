import { useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import CartItem from "../components/Navigation/Cart/CartItem";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function PurchasePage() {
    const { cart, getCart } = useCart();
    const { checkAuth, user } = useAuth();
    const { register, handleSubmit, setValue, watch } = useForm();
    const navigate = useNavigate();

    const code = watch("code");

    useEffect(() => {
        const loadPage = async () => {
            try {
                await checkAuth(); // Check authentication
                await getCart();   // Load cart details
            } catch (error) {
                console.error("Error:", error);
            } finally {
                if (user?.email && !user?.roles.includes("user")) {
                    navigate("/verify");
                }
            }
        };

        loadPage();
    }, [checkAuth, getCart, navigate, user?.email, user?.roles]);

    // Handle discount code submission
    const handleDiscountCheck = async () => {
        try {
            const response = await axios.get(
                `http://localhost:7000/api/v1/users/discounts/${code}`,
                { withCredentials: true }
            );
            console.log("Discount applied:", response.data.data);
            await getCart(); // Refresh cart to reflect discount
            setValue("code", ""); // Clear code input
        } catch (err) {
            console.error("Error applying discount:", err);
        }
    };

    // Clear cart function
    const clearCart = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:7000/api/v1/users/cart/clear`,
                { withCredentials: true }
            );
            console.log("Cart cleared:", response.data.data);
            await getCart(); // Refresh cart after clearing
        } catch (err) {
            console.error("Error clearing cart:", err);
        }
    };

    // Check if the cart is undefined or loading
    const items = cart?.items || [];  // If cart or items is undefined, fallback to an empty array

    return (
        <div className="flex space-x-8 p-8 h-full">
            {/* Left Section (Cart Items) */}
            <div className="w-3/5 h-full p-4 rounded-lg bg-slate-200 dark:bg-zinc-800 shadow flex flex-col dark:text-white">
                <h2 className="text-xl font-semibold mb-4">Your Cart Items</h2>
                <div className="flex-grow space-y-4 overflow-auto">
                    {items.length > 0 ? (
                        items.map((item: any) => {
                            const pricePerItem = parseFloat(item.total.$numberDecimal); // Calculate price per item
                            const totalPrice = parseFloat(item.total.$numberDecimal) * item.quantity; // Total price is provided in the total field

                            return (
                                <CartItem
                                    key={item.productId}
                                    productId={item.productId}
                                    quantity={item.quantity}
                                    pricePerItem={pricePerItem}
                                    totalPrice={totalPrice}
                                />
                            );
                        })
                    ) : (
                        <p>No items in cart</p>
                    )}
                </div>
                <button
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-full"
                    onClick={clearCart}
                >
                    Clear Cart
                </button>
            </div>

            {/* Right Section (Cart Summary) */}
            <div className="w-2/5 h-full p-4 rounded-lg bg-slate-200 dark:bg-zinc-800 dark:text-white shadow flex flex-col">
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <div className="space-y-2 flex-grow">
                    {/* Check if cart has the relevant data */}
                    <div className="flex justify-between">
                        <p>Code:</p>
                        <p>{cart?.code || "No code applied"}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Subtotal:</p>
                        <p>{cart?.subtotal ?? "0.00"}€</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Discount:</p>
                        <p>-{cart?.discount ?? "0.00"}€</p>
                    </div>
                    <div className="flex justify-between font-bold">
                        <p>Total:</p>
                        <p>{cart?.total ?? "0.00"}€</p>
                    </div>
                </div>

                {/* Discount Code Input */}
                <form onSubmit={handleSubmit(handleDiscountCheck)} className="mt-6">
                    <input
                        type="text"
                        placeholder="Discount code"
                        className="border-2 rounded-lg p-2 w-full text-center dark:bg-zinc-900"
                        {...register("code")}
                    />
                    <button
                        type="submit"
                        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full"
                    >
                        Apply Discount
                    </button>
                </form>

                {/* Proceed to Checkout Button */}
                <Link
                    to="/checkout"
                    className="mt-6 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full text-center"
                >
                    Next
                </Link>
            </div>
        </div>
    );
}
