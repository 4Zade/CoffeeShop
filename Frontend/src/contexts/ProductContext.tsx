import { createContext, useContext, useState } from "react";
import { ProductProps } from "../components/Products/ProductCard";
import axios from "axios";

interface ProductContextProps {
    products: ProductProps[];
    setProducts: (products: ProductProps[]) => void;

    refreshProducts?: (guild: string) => Promise<void>
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

    const refreshProducts = async (guild: string) => {
        try {
            let response;

            if (guild) {
                response = await axios.get(`http://localhost:7000/api/v1/products/${guild}`, { withCredentials: true });
                
                if (response.data) {
                    return setProducts(response.data.data);
                }
            }

            response = await axios.get(`http://localhost:7000/api/v1/products/`, { withCredentials: true });
            
            if (response.data) {
                setProducts(response.data.data);
                return Promise.resolve();
            }

            return Promise.reject();
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
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
