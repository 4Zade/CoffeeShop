import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import InputEye from "../Input/extras/InputEye";
import axios from "axios";
import { useAlert } from "../../contexts/AlertContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../Button";

interface FormInputs {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  repeat_password: string;
}

export default function RegisterForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormInputs>();
    const { successAlert, errorAlert } = useAlert();
    const { checkAuth, toggle } = useAuth();
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [visibleRepeatPassword, setVisibleRepeatPassword] = useState(false);

    const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
        try {
            await axios.post('/api/v1/auth/register', data, { withCredentials: true });
            successAlert('Paskyra sėkmingai sukurta!')
            toggle();
            checkAuth();
            navigate('/verify');
        }
        catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.errors) {
                // Parse Express Validator errors and set them to the form
                const apiErrors = err.response.data.errors;
                apiErrors.forEach((error: { path: string; msg: string }) => {
                    setError(error.path as keyof FormInputs, { type: 'manual', message: error.msg });
                });
            } else {
                // Set a general error for unknown issues
                setError("password", { type: "manual", message: "Nepavyko įkelti produkto. Bandykite dar kartą." });
                errorAlert("Klaida įkeliant duomenis.");
            }
        }
    }

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <section>
                    <label 
                        htmlFor="first_name" 
                        className="
                            text-base font-semibold ml-2 bg-clip-text text-transparent
                            bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                        "
                    >
                        Vardas
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
                                {...register('first_name')}
                                placeholder="Vardas"
                                className="grow h-full bg-transparent py-2 px-4 dark:text-white appearance-none outline-none"
                            />
                        </div>
                    </div>

                    {errors?.first_name ? <p className="text-red-500 text-sm mt-1 ml-2">{errors?.first_name?.message as string}</p> : <p className="w-full h-6"></p>}
                </section>

                <section>
                    <label 
                        htmlFor="last_name" 
                        className="
                            text-base font-semibold ml-2 bg-clip-text text-transparent
                            bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                        "
                    >
                        Pavardė
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
                                type="text" 
                                {...register('last_name')}
                                placeholder="Pavardė"
                                className="grow h-full bg-transparent py-2 px-4 dark:text-white appearance-none outline-none"
                            />
                        </div>
                    </div>

                    {errors?.last_name ? <p className="text-red-500 text-sm mt-1 ml-2">{errors?.last_name?.message as string}</p> : <p className="w-full h-6"></p>}
                </section>

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
                                type={visiblePassword ? "text" : "password"}
                                {...register('password')}
                                placeholder="Slaptažodis"
                                className="grow h-full bg-transparent py-2 px-4 dark:text-white appearance-none outline-none"
                            />
                        </div>

                        <InputEye onClick={() => setVisiblePassword(!visiblePassword)} visibility={visiblePassword} />
                    </div>

                    {errors?.password ? <p className="text-red-500 text-sm mt-1 ml-2">{errors?.password?.message as string}</p> : <p className="w-full h-6"></p>}
                </section>

                <section>
                    <label 
                        htmlFor="repeat_password" 
                        className="
                            text-base font-semibold ml-2 bg-clip-text text-transparent
                            bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                        "
                    >
                        Pakartoti slaptažodį
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
                                type={visibleRepeatPassword ? "text" : "password"}
                                {...register('repeat_password')}
                                placeholder="Pakartoti slaptažodį"
                                className="grow h-full bg-transparent py-2 px-4 dark:text-white appearance-none outline-none"
                            />
                        </div>

                        <InputEye onClick={() => setVisibleRepeatPassword(!visibleRepeatPassword)} visibility={visibleRepeatPassword} />
                    </div>

                    {errors?.repeat_password ? <p className="text-red-500 text-sm mt-1 ml-2">{errors?.repeat_password?.message as string}</p> : <p className="w-full h-6"></p>}
            </section>

            <Button type="submit" icon="tabler:arrow-right" onClick={handleSubmit(onSubmit)}>Registruotis</Button>
        </div>
    )
}
