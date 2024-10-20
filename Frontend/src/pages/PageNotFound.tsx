import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext";

export default function PageNotFound() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <main className="w-full h-full flex flex-col items-center justify-center gap-2">
            <h1 className="text-8xl font-bold text-coffee-400 dark:text-coffee-200">404</h1>
            <h2 className="text-6xl font-bold text-coffee-300 dark:text-white">Page Not Found</h2>
            <p className="text-xl font-bold text-black dark:text-white">(Or its being developed)</p>
        </main>
    )
}