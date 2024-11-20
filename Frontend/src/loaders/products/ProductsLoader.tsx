import axios from "axios";
import { LoaderFunctionArgs } from "react-router-dom";

export default async function productsLoader({ params }: LoaderFunctionArgs) {
    const category = params.category;

    try {
        let response;
        
        if (category) {
            response = await axios.get(`/api/v1/products/${category}`, { withCredentials: true });
            return response.data.data; 
        }

        response = await axios.get("/api/v1/products", { withCredentials: true });
        return response.data.data;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}