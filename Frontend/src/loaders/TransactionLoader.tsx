import axios from "axios";
import { LoaderFunctionArgs } from "react-router-dom";

export default async function transactionLoader({ params }: LoaderFunctionArgs) {
    const { id } = params;

    try {
        const response = await axios.get(`/api/v1/transactions/${id}`, { withCredentials: true });
        return response.data.transaction;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}