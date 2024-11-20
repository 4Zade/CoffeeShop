import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DiscountList from "./DiscountList";
import DiscountForm from "./DiscountForm";
import Button from "../../../Button";

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
            await axios.delete(`/api/v1/users/discounts/${code}`, { withCredentials: true });
            setAction('');
            refreshCodes(); // Refresh codes after deleting
        } catch (err) {
            console.log(err);
        }
    }, []);

    const editDiscount = useCallback(async (code: string, updatedCode: DiscountProps) => {
        try {
            await axios.patch(`/api/v1/users/discounts/${code}`, updatedCode, { withCredentials: true });
            setAction('');
            refreshCodes(); // Refresh codes after editing
        } catch (err) {
            console.log(err);
        }
    }, []);

    const addDiscount = useCallback(async (newCode: DiscountProps) => {
        try {
            await axios.post("/api/v1/users/discounts", newCode, { withCredentials: true });
            setAction('');
            refreshCodes(); // Refresh codes after adding
        } catch (err) {
            console.log(err);
        }
    }, []);

    const refreshCodes = useCallback(async () => {
        try {
            const res = await axios.get("/api/v1/users/discounts", { withCredentials: true });
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
                    className="w-full sm:w-[520px] h-full sm:max-h-[720px] bg-[#f1e2d2] dark:bg-[#523428] rounded-xl shadow-lg flex flex-col px-4 py-4 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <section className="grow overflow-y-scroll">
                        <DiscountList 
                            codes={codes} 
                            openEdit={editForm} 
                            deleteCode={deleteCode} 
                        />
                    </section>

                    <Button type="width" onClick={addForm} icon="tabler:plus">Add Discount</Button>

                    {
                        (action === 'add' || action === 'edit') && (
                            <section className="absolute top-0 right-0 w-full h-full bg-[#f1e2d2] dark:bg-[#523428] rounded-xl">
                                <DiscountForm addDiscount={addDiscount} editDiscount={editDiscount} code={code} action={action}/>
                            </section>
                        )
                    }
                </div>
            </div>
        </div>
        
    );
}
