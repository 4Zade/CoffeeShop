import ProductForm from "./ProductForm";
import { useAlert } from "../../../../contexts/AlertContext";

export default function ProductPopup() {
    const { action } = useAlert();

    return (
        <main 
            className="
                w-full sm:w-[520px] h-min sm:max-h-[720px] rounded-3xl shadow-lg flex flex-col z-[100]
                dark:bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] bg-white
            "
            onClick={(e) => e.stopPropagation()}
        >
            <div 
                className="
                    w-full h-full rounded-3xl p-0.5
                    bg-gradient-to-br from-transparent dark:from-transparent via-30% via-[#f1e2d2] dark:via-[#523428] to-[#f1e2d2] dark:to-[#523428]
                "
            >
                <div className="w-full h-full bg-[#f1e2d2] dark:bg-[#523428] rounded-3xl p-2 flex flex-col px-8 py-6 gap-4">
                    <h1 
                        className="
                            text-3xl font-bold text-center bg-clip-text text-transparent
                            bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                        "
                    >
                        { action === "add" ? "Pridėti produktą" : "Redaguoti produktą"}
                    </h1>
                    <ProductForm formType={action}/>
                </div>
            </div>
        </main>
    )
}