import { useEffect } from "react";
import ContactsForm from "../components/Forms/ContactsForm";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ContactsPage () {
    const { checkAuth, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadPage = async () => {
            try {
                await checkAuth();
            } catch (error) {
                console.error('Error:', error);
            } finally {
                if (!user) {
                    navigate("/");
                } else if (user?.email && !user?.roles.includes("user")) {
                    navigate("/verify");
                }
            }
        };

        loadPage();
    }, [user, checkAuth, navigate]);

    return <ContactsForm />;
}
