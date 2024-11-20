import Button from "../../../Button";
import Input from "../../../Input";
import { useForm } from "react-hook-form";
import { useAlert } from "../../../../contexts/AlertContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProduct } from "../../../../contexts/ProductContext";
import ProductImageDrop from "./ProductImageDrop";

interface FormInputs {
    name: string;
    description: string;
    category: string;
    price: number;
    size: string;
}

interface ProductProps {
    name: string;
    description: string;
    category: string;
    price: {
        $numberDecimal: string
    } | number;
    size: string;
}

export default function ProductForm({ formType }: { formType: string}) {
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshProducts } = useProduct();
    const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm();
    const { closeModal, successAlert, errorAlert, product } = useAlert();
    const [productData, setProductData] = useState<ProductProps>({
        name: '',
        description: '',
        category: '',
        price: 0,
        size: '',
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const dropdownData = [
        "Kavos Pupelės",
        "Aromatizuota Kava",
        "Kavos Be Kafeino",
        "Šalta Kava",
        "Specijalios Kavos",
        "Kitos Kavos"
    ]

    const locationEnd = location.pathname.split('/')[location.pathname.split('/').length - 1];

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/api/v1/products/id/${product.id}`, { withCredentials: true });
            setProductData({
                name: response.data.data.name,
                description: response.data.data.description,
                category: response.data.data.category,
                price: parseFloat(response.data.data.price.$numberDecimal),
                size: response.data.data.size
            });
            setValue('name', response.data.data.name);
            setValue('description', response.data.data.description);
            setValue('category', response.data.data.category);
            setValue('price', response.data.data.price.$numberDecimal);
            setValue('size', response.data.data.size);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (formType === 'edit') {
            fetchProduct();
        }
    }, []);
    
    const onSubmit = async (data: FormInputs) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('price', data.price.toString());
        formData.append('size', data.size);

        if (selectedImage) {
            formData.append("image", selectedImage); // Append the image
        }

        try {
            if (formType === 'add') {
                await axios.post("/api/v1/products", formData, { withCredentials: true });
                refreshProducts({ category: locationEnd });
                closeModal();
                successAlert("Pavadinimas pridėtas");
                return;
            }

            if (formType === 'edit') {
                await axios.patch(`/api/v1/products/${product.id}`, formData, { withCredentials: true });
                closeModal();
                successAlert("Pavadinimas redaguotas");
                navigate('/produktai');
                return;
            }

            errorAlert("Klaida")
            return null;
        }
        catch (err) {
            console.error(err);
        
            if (axios.isAxiosError(err) && err.response?.data?.errors) {
                // Parse Express Validator errors and set them to the form
                const apiErrors = err.response.data.errors;
                apiErrors.forEach((error: { path: string; msg: string }) => {
                    setError(error.path as keyof FormInputs, { type: 'manual', message: error.msg });
                });
            } else {
                // Set a general error for unknown issues
                setError("productName", { type: "manual", message: "Nepavyko įkelti produkto. Bandykite dar kartą." });
                errorAlert("Klaida įkeliant duomenis.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col gap-6">
            <section className="flex flex-col gap-2">
                <Input 
                    type="text" 
                    inputName="Prekės Pavadinimas" 
                    placeholder="Prekės pavadinimas"
                    max={64}
                    value={productData ? productData.name : ''}
                    register={register('name')}
                    error={errors.name?.message as string | undefined}
                />

                <Input 
                    type="text" 
                    inputName="Prekės Aprašymas" 
                    placeholder="Prekės aprašymas"
                    max={512}
                    value={productData ? productData.description : ''}
                    register={register('description')}
                    error={errors.description?.message as string | undefined}
                />

                <Input 
                    type="select"
                    dropdownOptions={dropdownData}
                    inputName="Prekės Kategorija"
                    setValue={setValue}
                    value={productData ? productData.category : ''}
                    error={errors.category?.message as string | undefined}
                />

                <Input 
                    type="number" 
                    endSlot="€"
                    inputName="Prekės Kaina" 
                    placeholder="Prekės kaina"
                    value={productData ? String(productData.price) : ''}
                    register={register('price')}
                    error={errors.price?.message as string | undefined}
                />

                <Input 
                    type="unit"
                    endSlot="g"
                    inputName="Prekės dydis" 
                    placeholder="Prekės dydis"
                    value={productData ? productData.size : ''}
                    register={register('size')}
                    error={errors.size?.message as string | undefined}
                />

                <ProductImageDrop onImageSelect={(file: File) => setSelectedImage(file)} />
            </section>

            <section className="w-full flex items-center gap-4">
                <Button type="width" icon="tabler:x" onClick={closeModal}>Atšaukti</Button>
                <Button type="submit" icon={formType === "add" ? "tabler:plus" : "tabler:edit"}>{formType === "add" ? "Pridėti" : "Redaguoti"}</Button>
            </section>
        </form>
    )
}