import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import Input from "../../components/Input"
import Button from "../../components/Button";
import axios from "axios";
import { useAlert } from "../../contexts/AlertContext"

interface FormData {
    address: string;
    city: string;
    zip: string;
    first_name: string;
    last_name: string;
    card_number: number;
    cvv: number;
    expires: string;
    terms: boolean;
}

export default function CheckoutPage() {
    const { checkAuth } = useAuth();
    const { successAlert, errorAlert } = useAlert();
    const { register, handleSubmit, setError, formState: { errors }} = useForm();
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const onSubmit = async (data: FormData) => {
        try {
            if (!data.terms) {
                setError("terms", { type: "manual", message: "Prašome sutinkimui" });
                return;
            }

            await axios.post(`/api/v1/purchase`, data, { withCredentials: true });
            successAlert("Pirkimas įvykdytas");
            return navigate("/");
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
                setError("first_name", { type: "manual", message: "Nepavyko įkelti produkto. Bandykite dar kartą." });
                errorAlert("Klaida vykdant pirkimą.");
            }
        }
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
                        w-full h-full bg-gradient-to-br from-slate-100 to-[#f1e2d2] dark:from-[#523428] dark:to-[#523428] rounded-xl p-4 flex relative
                    "
                >

                    <motion.div
                        animate={step === 1 ? { scaleX: 1, transition: { duration: 0.5, ease: "easeInOut" }} : { scaleX: 0, transition: { duration: 0.5, ease: "easeInOut" } }} 
                        className="
                            w-full h-full p-4 overflow-hidden flex flex-col justify-between
                        "
                    >
                        <section className="w-full">
                            <h1 
                                className="
                                    font-bold text-2xl bg-clip-text text-transparent text-center
                                    bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                                "
                            >
                            </h1>

                            <Input
                                type="text"
                                inputName="Adresas"
                                placeholder="Adresas"
                                register={register('address')}
                            />

                            <Input
                                type="text"
                                inputName="Miestas"
                                placeholder="Miestas"
                                register={register('city')}
                            />

                            <Input
                                type="number"
                                inputName="Zip kodas"
                                placeholder="Zip kodas"
                                max={5}
                                register={register('zip')}
                            />
                        </section>
                    </motion.div>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={step === 2 ? { scaleX: 1, transition: { duration: 0.5, ease: "easeInOut" }} : { scaleX: 0, transition: { duration: 0.5, ease: "easeInOut" } }} 
                        className="
                            w-full h-full p-4 overflow-hidden flex flex-col justify-between absolute top-0 left-0 origin-right
                        "
                    >
                        <section className="w-full">
                            <h1 
                                className="
                                    font-bold text-2xl bg-clip-text text-transparent text-center
                                    bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                                "
                            >
                            </h1>

                            <Input
                                type="number"
                                inputName="Kortelės numeris"
                                placeholder="Kortelės numeris"
                                max={16}
                                register={register('card_number')}
                            />

                            <Input
                                type="text"
                                inputName="CVV"
                                placeholder="CVV"
                                max={3}
                                register={register('cvv')}
                            />

                            <Input
                                type="text"
                                inputName="Galiojimo pabaiga"
                                placeholder="Galiojimo pabaiga"
                                max={5}
                                register={register('expiry')}
                            />

                            <label htmlFor="terms">
                                <input
                                    type="checkbox"
                                    className="peer cursor-pointer"
                                    id="terms"
                                    {...register('terms')}
                                />
                                <span className={`ml-2 ${errors?.terms ? "text-red-500" : "dark:text-white"}`}>
                                    Sutikite su paslaugų teikimo sąlygomis ir saugumo politika.
                                </span>
                            </label>
                        </section>
                    </motion.div>

                    <footer className="w-full absolute bottom-0 left-0 p-4 flex items-center gap-2 -mb-20 lg:mb-0">
                        {
                            step === 2 && <Button type="width" icon="tabler:arrow-left" onClick={() => setStep(step - 1)}>Atgal</Button>
                        }
                        {
                            step === 1 ? <Button type="width" icon="tabler:arrow-right" onClick={() => setStep(step + 1)}>Toliau</Button>
                            :
                            <Button type="submit" icon="tabler:arrow-right" onClick={handleSubmit(onSubmit as (data: any) => void)}>Pirkti</Button>
                        }
                        
                    </footer>

                </div>
            </div>
        </aside>
    )
}