import { useState } from "react";
import axios from "axios";

import AdminList from "./AdminList";
import AdminSearch from "./AdminSearch";


export default function AdminModal() {
    const [admins, setAdmins] = useState([]);

    const getAdmins = async () => {
        try {
            const response = await axios.get("http://localhost:7000/api/v1/users/admins", { withCredentials: true });
            setAdmins(response.data.data);
        } 
        catch (error) {
            console.error('Error:', error);
        }
    }

    const addAdmin = async (id: number) => {
        try {
            await axios.post(`http://localhost:7000/api/v1/users/admins/${id}`, {}, { withCredentials: true });
            await getAdmins();
        }
        catch (err) {
            console.log(err);
        }
    }

    const removeAdmin = async (id: number) => {
        try {
            await axios.delete(`http://localhost:7000/api/v1/users/admins/${id}`, { withCredentials: true });
            await getAdmins();
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
            <div 
                className="w-full sm:w-[520px] h-full sm:max-h-[720px] bg-slate-100 dark:bg-zinc-700 rounded-3xl shadow-lg flex flex-col px-4 py-4 z-[100]"
                onClick={(e) => e.stopPropagation()}
            >
                <AdminSearch addAdmin={addAdmin}/>

                <AdminList getAdmins={getAdmins} admins={admins} removeAdmin={removeAdmin}/>
            </div>
    )
}