import axios from "axios";

export default async function transactionsLoader() {
    try {
        const response = await axios.get(`http://localhost:7000/api/v1/transactions`, { withCredentials: true });
        return response.data.transactions;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}