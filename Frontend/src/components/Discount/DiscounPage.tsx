import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import DiscountCard from "./DiscountCard";

interface DiscountProps {
    code: string;
    percentage: number;
    expiry: string;
}



export default function DiscountPage() {
    const [discounts, setDiscounts] = useState([] as DiscountProps[]);
    const { checkAuth } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getDiscounts() {
            try {
                await checkAuth();
                const response = await axios.get("http://localhost:7000/api/v1/discounts"); // Assuming you're fetching discounts
                setDiscounts(response.data.data); // Ensure data is structured correctly
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false); // You can remove the setTimeout if you don't need the delay
            }
        }
        getDiscounts();
    }, [checkAuth]);

    // Ensure JSX is returned
    return (
        <div>
            {discounts.map((discount: DiscountProps) => (
                <DiscountCard
                    key={discount.code}  // Assuming `code` is unique
                    discount={discount}
                    loading={loading}
                />
            ))}
        </div>
    );
}
