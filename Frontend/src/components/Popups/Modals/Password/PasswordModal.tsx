import { useForm } from "react-hook-form";
import { useAlert } from "../../../../contexts/AlertContext";
import Button from "../../../Button";
import Input from "../../../Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

export default function PasswordModal() {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const { closeModal, successAlert, errorAlert } = useAlert();
    const { logout } = useAuth();

    const onSubmit = async (data: { password: string }) => {
        try {
            await axios.delete('/api/v1/auth/delete', { data, withCredentials: true });
            successAlert("Paskyra sėkmingai ištrinta");
            logout();
            closeModal();
            navigate('/');
        }
        catch (err: any) {
            setError("password", {
                type: "server",
                message: err.response?.data?.message || "Iškilo problema ištrinant paskyrą.",
            });
            errorAlert(err.response?.data?.message || "Iškilo problema ištrinant paskyrą.");
        }
    }

    return (
        <section
            onClick={(e) => e.stopPropagation()}
            className="
                w-min h-min rounded-xl
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
                        w-full h-full bg-[#523428] rounded-xl p-2 flex flex-col justify-between gap-2 px-6 py-4
                    "
                >
                    <h1 
                        className="
                            text-2xl font-bold lg:whitespace-nowrap text-center bg-clip-text text-transparent
                            bg-gradient-to-tr from-[#C29469] via-[#ccc5c3] to-[#C29469]
                        "
                    >
                        Ar tikrai norite ištrinti savo paskyrą?
                    </h1>
                    <p className=" text-center text-[#ccc5c3]">Prašome įrašykite savo slaptažodį.</p>

                    <Input
                        type="password"
                        inputName="Slaptažodis"
                        placeholder="Slaptažodis"
                        autocomplete={false}
                        register={register("password", { required: "Slaptažodis yra privalomas!" })}
                        error={errors.password?.message as string | undefined} 
                    />

                    <section className="w-full h-full flex items-center gap-4">
                        <Button type="submit" onClick={handleSubmit(onSubmit as any)}>Ištrinti</Button>
                        <Button type="width" onClick={closeModal}>Atšaukti</Button>
                    </section>
                </div>
            </div>
        </section>
    )
}