import Button from "../../../Button";
import Input from "../../../Input";
import { useForm } from "react-hook-form";
import { useAlert } from "../../../../contexts/AlertContext";
import axios from "axios";

interface FormInputs {
    productName: string;
    productDescription: string;
    productCategory: string;
    productPrice: number;
    productSize: string;
}

export default function ProductForm({ formType }: { formType: string}) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { closeModal, successAlert, errorAlert } = useAlert();

    const dropdownData = [
        "Kavos Pupelės",
        "Aromatizuota Kava",
        "Kavos Be Kafeino",
        "Šalta Kava",
        "Specijalios Kavos",
        "Kitos Kavos"
    ]

    const onSubmit = async (data: FormInputs) => {
        try {
            if (formType === 'add') {
                await axios.post("http://localhost:7000/api/v1/products", {
                    name: data.productName,
                    description: data.productDescription,
                    category: data.productCategory,
                    price: data.productPrice,
                    size: data.productSize
                }, { withCredentials: true });
                closeModal();
                successAlert("Pavadinimas pridėtas");
                return;
            }

            if (formType === 'edit') {
                await axios.put("http://localhost:7000/api/v1/products", data, { withCredentials: true });
                closeModal();
                successAlert("Pavadinimas redaguotas");
                return;
            }

            errorAlert("Klaida")
            return null;
        }
        catch (err) {
            console.log(err);
            errorAlert("Klaida")
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <section className="flex flex-col gap-2">
                <Input 
                    type="text" 
                    inputName="Prekės Pavadinimas" 
                    placeholder="Prekės pavadinimas"
                    register={register('productName', { required: 'Prekės pavadinimas yra privalomas.' })}
                    error={errors.productName?.message as string | undefined}
                />

                <Input 
                    type="text" 
                    inputName="Prekės Aprašymas" 
                    placeholder="Prekės aprašymas"
                    register={register('productDescription', { required: 'Prekės aprašymas yra privalomas.' })}
                    error={errors.productDescription?.message as string | undefined}
                />

                <Input 
                    type="select"
                    dropdownData={dropdownData}
                    inputName="Prekės Kategorija"
                    setValue={setValue}
                    register={register('productCategory', { required: 'Prekės kategorija yra privaloma.' })}
                    error={errors.productCategory?.message as string | undefined}
                />

                <Input 
                    type="number" 
                    currency="eur"
                    inputName="Prekės Kaina" 
                    placeholder="Prekės kaina"
                    register={register('productPrice', { required: 'Prekės kaina yra privaloma.' })}
                    error={errors.productPrice?.message as string | undefined}
                />

                <Input 
                    type="unit" 
                    inputName="Prekės dydis" 
                    placeholder="Prekės dydis"
                    register={register('productSize', { required: 'Prekės dydis yra privalomas.' })}
                    error={errors.productSize?.message as string | undefined}
                />
            </section>

            <section className="w-full flex items-center gap-4">
                <Button type="width" icon="tabler:x" onClick={closeModal}>Atšaukti</Button>
                <Button type="submit" icon={formType === "add" ? "tabler:plus" : "tabler:edit"}>{formType === "add" ? "Pridėti" : "Redaguoti"}</Button>
            </section>
        </form>
    )
}