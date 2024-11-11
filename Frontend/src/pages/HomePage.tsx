import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function HomePage() {
    const { checkAuth } = useAuth();

    useEffect(() => {
        const loadPage = async () => {
            try {
                await checkAuth();
            }
            catch (error) {
                console.error('Error:', error);
            }
        }

        loadPage();
    }, []);

    return (
        <h1 className="text-3xl font-bold underline text-black">
            Home
        </h1>
    );
}