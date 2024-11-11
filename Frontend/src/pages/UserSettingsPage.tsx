import { useEffect } from "react";
import UserSettingsForm from "../components/Forms/UserSettingsForm";
import { useAuth } from "../contexts/AuthContext";

export default function UserSettingsPage () {
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
    })


    return(
        <UserSettingsForm/>
    )
}