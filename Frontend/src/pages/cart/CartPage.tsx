import Button from "../../components/Button";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import { CartItemProps } from "../../layouts/CartLayout";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useOutletContext } from "react-router-dom";

interface CartProps {
    items: CartItemProps[];
    code: string;
    total: string;
    subtotal: string;
    discount: string;
    percentage: number;
    count: number;
}

export default function CartMain() {
    const cart = useOutletContext<CartProps>();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const { getCart } = useCart();
    const { checkAuth } = useAuth();
    const [customError, setCustomError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (data: { code: string }) => {
        try {
            await axios.get(`/api/v1/users/discounts/${data.code}`, { withCredentials: true });
            await getCart();
        }
        catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.errors) {
                // Parse Express Validator errors and set them to the form
                const apiErrors = err.response.data.errors;
                apiErrors.forEach((error: { path: string; msg: string }) => {
                    setError(error.path as string, { type: 'manual', message: error.msg });
                });
            } else {
                // Set a general error for unknown issues
                setError("code", { type: "manual", message: "Nepavyko įkelti produkto. Bandykite dar kartą." });
            }
        }
    }

    const goToCheckout = async () => {
        if (parseFloat(cart.total) > 0) {
            setCustomError(null);
            return navigate('atsiskaitymas');
        }

        setCustomError('Krepšelis negali būti tuščias')
    }

    useEffect(() => {
        checkAuth();
    }, [])

    return (
        <aside className="w-full h-full bg-gradient-to-br from-[#C29469] via-[#ccc5c3] to-[#C29469] rounded-xl">
            <div
                className="
                    w-full h-full rounded-xl bg-gradient-to-br from-transparent via-30% dark:via-[#523428] via-slate-100 dark:to-[#523428] to-[#f1e2d2] p-0.5
                "
            >
                <div
                    className="
                        w-full h-full bg-gradient-to-br from-slate-100 to-[#f1e2d2] dark:from-[#523428] dark:to-[#523428] rounded-xl p-4 flex flex-col justify-between gap-4
                    "
                >
                    <section>
                        <div className="w-full h-auto">
                            <h1 
                                className="
                                    font-bold bg-clip-text text-transparent
                                    bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                                "
                            >
                                Kodas:
                            </h1>
                            <div className="w-full min-h-10 px-4 py-2 bg-slate-200 dark:bg-[#3d292e] dark:text-white rounded-full">
                                <p>{cart.code}</p>
                            </div>
                        </div>

                        <div>
                            <h1 
                                className="
                                    font-bold bg-clip-text text-transparent
                                    bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                                "
                            >
                                Produktai:
                            </h1>
                            <div className="w-full px-4 py-2 bg-slate-200 dark:bg-[#3d292e] dark:text-white rounded-full">
                                <p>{cart.count && cart.count}</p>
                            </div>
                        </div>

                        <div>
                            <h1 
                                className="
                                    font-bold bg-clip-text text-transparent
                                    bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                                "
                            >
                                Suma prieš nuolaidas:
                            </h1>
                            <div className="w-full px-4 py-2 bg-slate-200 dark:bg-[#3d292e] dark:text-white rounded-full">
                                <p>{cart.subtotal && cart.subtotal}€</p>
                            </div>
                        </div>

                        <div>
                            <h1 
                                className="
                                    font-bold bg-clip-text text-transparent
                                    bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                                "
                            >
                                Nuolaida:
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="w-1/2 px-4 py-2 bg-slate-200 dark:bg-[#3d292e] dark:text-white rounded-full">
                                    <p>{cart.discount && cart.discount}€</p>
                                </div>

                                <div className="w-1/2 px-4 py-2 bg-slate-200 dark:bg-[#3d292e] dark:text-white rounded-full">
                                <p>{cart.percentage | 0}%</p>
                            </div>
                            </div>
                        </div>

                        <div>
                            <h1 
                                className="
                                    font-bold bg-clip-text text-transparent
                                    bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                                "
                            >
                                Suma:
                            </h1>
                            <div className="w-full px-4 py-2 bg-slate-200 dark:bg-[#3d292e] dark:text-white rounded-full">
                                <p>{cart.total && cart.total}€</p>
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col gap-2">
                        <Input
                            type="text"
                            inputName="Kuponas"
                            placeholder="Kuponas"
                            register={register('code')}
                            error={errors.code?.message as string}
                        />

                        <Button type="submit" icon="tabler:plus" onClick={handleSubmit(onSubmit as (data: any) => void)}>Patvirtinti kuponą</Button>

                        <Button type="width" icon="tabler:arrow-right" onClick={goToCheckout}>Eiti į atsiskaitymą</Button>
                        <p className="h-6 w-full text-red-500 text-sm mt-1 ml-2">{customError}</p>
                    </section>
                </div>
            </div>
        </aside>
    )
}