import axios from "axios";
import { LoaderFunctionArgs } from "react-router-dom";

export default async function productLoader({ params }: LoaderFunctionArgs) {
    const { id } = params;

    try {
        const response = await axios.get(`/api/v1/products/id/${id}`, { withCredentials: true });
        return response.data.data;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}