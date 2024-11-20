import Input from "../Input"
import { useForm } from "react-hook-form"
import { useAlert } from "../../contexts/AlertContext";
import axios from "axios";
import Button from "../Button";

export default function ChangePasswordForm() {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const { successAlert, errorAlert } = useAlert();

    const onSubmit = async (data: { first_name: string; last_name: string; }) => {
        try {
            await axios.patch(`/api/v1/auth/password/change`, data, { withCredentials: true });
            successAlert("Slaptažodis sėkmingai pakeistas!");
            return
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
                setError("password", { type: "manual", message: "Nepavyko įkelti produkto. Bandykite dar kartą." });
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
                        Pasikeisk slaptažodį
                    </h1>
                    <Input
                        type="password"
                        inputName="Slaptažodis"
                        placeholder="Slaptažodis"
                        register={register("password")}
                        error={errors.password?.message as string}
                    />

                    <Input
                        type="password"
                        inputName="Naujas slaptažodis"
                        placeholder="Naujas slaptažodis"
                        register={register("newPassword")}
                        error={errors.newPassword?.message as string}
                    />

                    <Input
                        type="password"
                        inputName="Pakartoti naują slaptažodą"
                        placeholder="Pakartoti naują slaptažodą"
                        register={register("confirmPassword")}
                        error={errors.confirmPassword?.message as string}
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