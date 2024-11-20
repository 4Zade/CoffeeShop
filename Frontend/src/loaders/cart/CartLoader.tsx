import axios from "axios";
import { redirect } from "react-router-dom";

export default async function cartLoader() {

    try {
        const response = await axios.get(`/api/v1/users/cart`, { withCredentials: true });
        return response.data.data;
    }
    catch (error) {
        console.log(error);
        return redirect('/');
    }
}