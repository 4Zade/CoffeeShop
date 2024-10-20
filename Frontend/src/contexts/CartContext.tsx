import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

interface CartContextProps {
    total: number
    subtotal: number
    discount: number
    percentage: number

    setTotal?: () => void
    setSubtotal?: () => void
    setDiscount?: () => void
    setPercentage?: () => void
}

const defaultContextValue: CartContextProps = {
    total: 0,
    subtotal: 0,
    discount: 0,
    percentage: 0,

    setTotal: () => {},
    setSubtotal: () => {},
    setDiscount: () => {},
    setPercentage: () => {},
};

export const CartContext = createContext<CartContextProps>(defaultContextValue);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<any[]>([]);
    const [count, setCount] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [percentage, setPercentage] = useState<number>(0);

    const getCart = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:7000/api/v1/users/cart/total', { withCredentials: true });
            setTotal(response.data.data.total);
        }
        catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <CartContext.Provider value={{ total, subtotal, discount, percentage, }}>
            {children}
        </CartContext.Provider>
    );
};

const useAuth = () => useContext(CartContext);

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
