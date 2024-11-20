import { createContext, useContext, useState } from "react";
import { ProductProps } from "../components/Products/ProductCard";
import axios from "axios";

interface ProductContextProps {
    products: ProductProps[];
    setProducts: (products: ProductProps[]) => void;

    refreshProducts: ({ category }: { category?: string}) => void
}

const defaultContextValue: ProductContextProps = {
    products: [],
    setProducts: async () => {},

    refreshProducts: async () => {},
};

export const ProductContext = createContext<ProductContextProps>(defaultContextValue);

const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProductsArr] = useState<ProductProps[]>([]);

    const setProducts = async (products: ProductProps[]) => {
        setProductsArr(products);
    }

    const refreshProducts = async ({ category }: { category?: string}) => {
        try {
            let response;

            if (category) {
                response = await axios.get(`/api/v1/products/${category}`, { withCredentials: true });
                
                if (response.data) {
                    setProducts(response.data.data);
                    return
                }
            }

            response = await axios.get(`/api/v1/products/`, { withCredentials: true });
            
            if (response.data) {
                setProducts(response.data.data);
                return
            }

        } catch (err) {
            console.log(err);
        }
    }
    
    return (
        <ProductContext.Provider value={{ products, setProducts, refreshProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

const useProduct = () => useContext(ProductContext);

// eslint-disable-next-line react-refresh/only-export-components
export { ProductProvider, useProduct };
