import { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminSearchList from "./AdminSearchList";

export default function AdminSearch({ addAdmin }: { addAdmin: (id: number) => void }) {
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get("http://localhost:7000/api/v1/users", { withCredentials: true });
                setUsers(response.data.data);
            }
            catch (err) {
                console.log(err);
            }
        }

        getUsers();
    }, [addAdmin]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                console.log("Clicked outside dropdown");
                setOpen(false)
            }
        }

        if (open) {
            document.addEventListener("pointerdown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, [open, setOpen]);

    const onFocus = () => {
        if (search.length > 0) {
            setOpen(true);
        }
    }

    useEffect(() => {
        if (search.length > 0) {
            setOpen(true);
        }
        else {
            setOpen(false);
        }
    }, [search]);

    return (
        <section className="w-full relative" ref={searchRef}>
            <div className="w-full h-10 border shadow-sm bg-slate-200 dark:bg-zinc-800 border-slate-300 rounded-lg">
                <input 
                    type="text" 
                    className="w-full h-full px-4 py-2 rounded-lg" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    ref={inputRef}
                    onFocus={onFocus}
                />
            </div>

            <AdminSearchList users={users} search={search} open={open} addAdmin={addAdmin}/>
        </section>
    )
}