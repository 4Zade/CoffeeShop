import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DiscountList from "./DiscountList";
import DiscountForm from "./DiscountForm";

export interface DiscountProps {
    code: string;
    percentage: number;
    expires: string;
}

export default function DiscountModal() {
    const [codes, setCodes] = useState<DiscountProps[]>([]);
    const [action, setAction] = useState<"" | "add" | "edit">('');
    const [code, setCode] = useState<object>({});

    const editForm = useCallback((code: DiscountProps) => {
        setAction('edit');
        setCode(code);
        console.log(code)
    }, []);

    const addForm = useCallback(() => {
        setAction('add');
    }, []);

    const deleteCode = useCallback(async (code: string) => {
        try {
            await axios.delete(`http://localhost:7000/api/v1/users/discounts/${code}`, { withCredentials: true });
            setAction('');
            refreshCodes(); // Refresh codes after deleting
        } catch (err) {
            console.log(err);
        }
    }, []);

    const editDiscount = useCallback(async (code: string, updatedCode: DiscountProps) => {
        try {
            await axios.patch(`http://localhost:7000/api/v1/users/discounts/${code}`, updatedCode, { withCredentials: true });
            setAction('');
            refreshCodes(); // Refresh codes after editing
        } catch (err) {
            console.log(err);
        }
    }, []);

    const addDiscount = useCallback(async (newCode: DiscountProps) => {
        try {
            await axios.post("http://localhost:7000/api/v1/users/discounts", newCode, { withCredentials: true });
            setAction('');
            refreshCodes(); // Refresh codes after adding
        } catch (err) {
            console.log(err);
        }
    }, []);

    const refreshCodes = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:7000/api/v1/users/discounts", { withCredentials: true });
            setCodes(res.data.discounts);
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        refreshCodes(); // Initial fetch
    }, [refreshCodes]);

    return (
        <div 
            className="w-full sm:w-[520px] h-full sm:max-h-[720px] bg-slate-100 dark:bg-zinc-700 rounded-3xl shadow-lg flex flex-col px-4 py-4 relative"
            onClick={(e) => e.stopPropagation()}
        >
            <section className="grow overflow-y-scroll">
                <DiscountList 
                    codes={codes} 
                    openEdit={editForm} 
                    deleteCode={deleteCode} 
                />
            </section>

            <button 
                className="w-full h-10 rounded-xl bg-blue-400 font-bold dark:text-white"
                onClick={addForm}
            >
                Add Discount Code
            </button>

            {
                (action === 'add' || action === 'edit') && (
                    <section className="absolute top-0 right-0 w-full h-full bg-red-400">
                        <DiscountForm addDiscount={addDiscount} editDiscount={editDiscount} code={code} action={action}/>
                    </section>
                )
            }
        </div>
    );
}
