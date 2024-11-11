import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DiscountProps } from "./DiscountModal";

interface DiscountListProps {
    codes: DiscountProps[];
    openEdit: (code: DiscountProps) => void;
    deleteCode: (code: string) => void;
}

export default function DiscountList({ codes, openEdit, deleteCode }: DiscountListProps) {
    if (!codes || codes.length === 0) {
        return <p className="text-center dark:text-white">No discount codes available.</p>;
    }

    return (
        <>
            {codes.map((code) => (
                <div key={code.code} className="flex items-center justify-between gap-4 py-2">
                    <section className="flex items-center gap-4">
                        <div className="w-16 h-12 grid place-items-center text-2xl font-bold dark:text-white">
                            {code.percentage}%
                        </div>

                        <header className="flex flex-col dark:text-white">
                            <h1 className="font-bold">{code.code}</h1>
                            <p>{code.expires}</p>
                        </header>
                    </section>

                    <section className="flex items-center gap-2">
                        <button 
                            className="w-8 h-8 rounded-lg grid place-items-center hover:bg-slate-300 dark:hover:bg-zinc-600 dark:text-white"
                            onClick={() => openEdit(code)}
                        >
                            <Icon icon="tabler:edit" className="w-6 h-6" />
                        </button>

                        <button 
                            className="w-8 h-8 rounded-lg grid place-items-center hover:bg-slate-300 dark:hover:bg-zinc-600 text-red-400"
                            onClick={() => deleteCode(code.code)}
                        >
                            <Icon icon="tabler:trash" className="w-6 h-6" />
                        </button>
                    </section>
                </div>
            ))}
        </>
    );
}
