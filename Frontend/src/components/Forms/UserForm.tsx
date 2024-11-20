import Input from "../Input"
import { useForm } from "react-hook-form"
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";
import { useEffect } from "react";
import axios from "axios";
import Button from "../Button";

export default function UserForm() {
    const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm();
    const { user } = useAuth();
    const { successAlert, errorAlert } = useAlert();

    useEffect(() => {
        if (user) {
            console.log(user?.first_name, user?.last_name)
            setValue("first_name", user.first_name);
            setValue("last_name", user.last_name);
            return;
        }
    }, [(!user)]);

    const onSubmit = async (data: { first_name: string; last_name: string; }) => {
        try {
            if (data.first_name !== user?.first_name || data.last_name !== user?.last_name) {
                await axios.patch(`/api/v1/users`, data, { withCredentials: true });
                successAlert("Paskyra sėkmingai atnaujinta!");
                return;
            }

            errorAlert("Prašome pakeiskite vardą ar pavardę!");
            return
        }
        catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.errors) {
                // Parse Express Validator errors and set them to the form
                const apiErrors = err.response.data.errors;
                apiErrors.forEach((error: { path: string; msg: string }) => {
                    setError(error.path as string, { type: 'manual', message: error.msg });
                });
            } else {
                // Set a general error for unknown issues
                setError("first_name", { type: "manual", message: "Nepavyko įkelti produkto. Bandykite dar kartą." });
                errorAlert("Klaida įkeliant duomenis.");
            }
        }
    }

    return (
        <section
            className="
                lg:min-w-[460px] w-min h-min rounded-xl
                bg-gradient-to-tr from-[#C29469] via-[#ccc5c3] to-[#C29469]
            "
        >
            <div
                className="
                    w-full h-full p-0.5 rounded-xl
                    bg-gradient-to-br from-transparent via-30% via-[#523428] to-[#523428]
                "
            >
                <div
                    className="
                        w-full h-full bg-[#523428] rounded-xl p-2 flex flex-col justify-between gap-2 px-6 py-4 whitespace-nowrap
                    "
                >
                    <h1 
                        className="
                            text-3xl font-bold text-center bg-clip-text text-transparent
                            bg-gradient-to-tr from-[#C29469] via-[#ccc5c3] to-[#C29469]
                        "
                    >
                        Vartotojas
                    </h1>
                    <Input
                        type="text"
                        inputName="Vardas"
                        placeholder="Vardas"
                        register={register("first_name")}
                        error={errors.first_name?.message as string}
                    />

                    <Input
                        type="text"
                        inputName="Pavardė"
                        placeholder="Pavardė"
                        register={register("last_name")}
                        error={errors.last_name?.message as string}
                    />

                    <Input
                        type="email"
                        inputName="El. Paštas"
                        placeholder="El. Paštas"
                        disabled={true}
                        value={user?.email}
                    />

                    <Button
                        type="submit"
                        icon="tabler:send"
                        onClick={handleSubmit(onSubmit as any)}
                    >Keisti</Button>
                </div>
            </div>
        </section>
    )
  }