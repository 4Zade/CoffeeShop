import { useState } from "react";
import axios from "axios";

import AdminList from "./AdminList";
import AdminSearch from "./AdminSearch";


export default function AdminModal() {
    const [admins, setAdmins] = useState([]);

    const getAdmins = async () => {
        try {
            const response = await axios.get("/api/v1/users/admins", { withCredentials: true });
            setAdmins(response.data.data);
        } 
        catch (error) {
            console.error('Error:', error);
        }
    }

    const addAdmin = async (email: string) => {
        try {
            await axios.post(`/api/v1/users/admins/${email}`, {}, { withCredentials: true });
            await getAdmins();
        }
        catch (err) {
            console.log(err);
        }
    }

    const removeAdmin = async (email: string) => {
        try {
            await axios.delete(`/api/v1/users/admins/${email}`, { withCredentials: true });
            await getAdmins();
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
            <div 
                className="
                    w-full sm:w-[520px] h-full sm:max-h-[720px] rounded-xl
                    dark:bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] bg-white
                "
            >
                <div
                    className="
                        w-full h-full rounded-xl p-0.5
                        bg-gradient-to-br from-transparent dark:from-transparent via-30% via-[#f1e2d2] dark:via-[#523428] to-[#f1e2d2] dark:to-[#523428]
                    "
                >
                    <div 
                        className="w-full h-full bg-[#f1e2d2] dark:bg-[#523428] rounded-xl shadow-lg flex flex-col px-4 py-4 z-[100]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AdminSearch addAdmin={addAdmin}/>

                        <AdminList getAdmins={getAdmins} admins={admins} removeAdmin={removeAdmin}/>
                    </div>
                </div>
            </div>
    )
}