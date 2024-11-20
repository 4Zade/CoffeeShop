import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAlert } from "../../contexts/AlertContext";
import { useAuth } from "../../contexts/AuthContext";
import InputEye from "../Input/extras/InputEye";
import Button from "../Button";

export default function LoginForm() {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const { successAlert, errorAlert } = useAlert();
    const { toggle, checkAuth } = useAuth();
    const [visible, setVisible] = useState(false);

    const onSubmit = async (data: { email: string; password: string; remember: boolean; }) => {
        try {
            await axios.post('/api/v1/auth/login', data, { withCredentials: true });
            successAlert('Sėkmingai prisijungėte!')
            await checkAuth();
            toggle();
        }
        catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.data?.errors) {
                // Parse Express Validator errors and set them to the form
                const apiErrors = err.response.data.errors;
                apiErrors.forEach((error: { path: string; msg: string }) => {
                    setError(error.path as string, { type: 'manual', message: error.msg });
                });
            } 
            else if (axios.isAxiosError(err) && err.response?.data?.error) {
                const apiError = err.response.data.error;
                setError(apiError.path as string, { type: 'manual', message: apiError.message });
            }
            else {
                console.error(err.response.data.message);
                errorAlert('Iškilo klaida prisijungiant. Bandykite dar kartą.');
            }
        }
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <section>
                <label 
                    htmlFor="email" 
                    className="
                        text-base font-semibold ml-2 bg-clip-text text-transparent
                        bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                    "
                >
                    El.paštas
                </label>

                <div 
                    className={`
                        w-full h-min p-0.5 flex gap-0.5 rounded-full
                        bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                    `}
                >
                    <div 
                        className={`
                            grow h-full overflow-hidden flex rounded-full
                            dark:bg-[#3b2d2b] dark:hover:bg-[#66564c] hover:bg-[#F2CEA9] bg-[#EFD8BF] 
                            
                        `}
                    >
                        <input 
                            type="email" 
                            {...register('email')}
                            placeholder="El.paštas"
                            className="grow h-full bg-transparent py-2 px-4 dark:text-white appearance-none outline-none"
                        />
                    </div>
                </div>

                {errors?.email ? <p className="text-red-500 text-sm mt-1 ml-2">{errors?.email?.message as string}</p> : <p className="w-full h-6"></p>}
            </section>

            <section>
                <label 
                    htmlFor="password" 
                    className="
                        text-base font-semibold ml-2 bg-clip-text text-transparent
                        bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                    "
                >
                    Slaptažodis
                </label>
                <div 
                    className={`
                        w-full h-min p-0.5 flex gap-0.5 rounded-full
                        bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                    `}
                >
                    <div 
                        className={`
                            grow h-full overflow-hidden flex rounded-l-full
                            dark:bg-[#3b2d2b] dark:hover:bg-[#66564c] hover:bg-[#F2CEA9] bg-[#EFD8BF] 
                            
                        `}
                    >
                        <input 
                            type={visible ? "text" : "password"}
                            {...register('password')}
                            placeholder="Slaptažodis"
                            className="grow h-full bg-transparent py-2 px-4 dark:text-white appearance-none outline-none"
                        />
                    </div>

                    <InputEye onClick={() => setVisible(!visible)} visibility={visible} />
                </div>

                {errors?.password ? <p className="text-red-500 text-sm mt-1 ml-2">{errors?.password?.message as string}</p> : <p className="w-full h-6"></p>}
            </section>

            <section className="flex flex-col gap-4 mb-4 items-end">
                <Link to="/reset-password" className="text-[#66564c] dark:text-[#ccc5c3] underline">Pamiršai slaptažodį?</Link>

                <label htmlFor="remember" className="w-full flex justify-center items-center gap-2 text-black dark:text-white">
                    <input 
                        type="checkbox" 
                        id="remember"
                        {...register("remember")}
                    />
                    Prisiminti
                </label>
            </section>

            <Button 
                type="submit"
                icon="tabler:key"
                onClick={handleSubmit(onSubmit as any)}
            >
                Prisijungti
            </Button>
        </div>
    )
}
