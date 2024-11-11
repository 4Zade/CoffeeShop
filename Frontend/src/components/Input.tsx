import InputText from "./Input/InputText";
import InputSelect from "./Input/InputSelect";

export interface InputProps {
    type?: string;
    inputName?: string;
    placeholder?: string;
    error?: string;
    dropdownData?: string[]
    register: unknown
    currency?: string
    setValue?: unknown
}

export default function Input({ type = "text", inputName = "input", placeholder = "text", error, dropdownData = [], register, currency = "eur", setValue }: InputProps) {
    if (type === "text" || type === "email" || type === "password" || type === "number" || type === "unit") {
        return <InputText type={type} inputName={inputName} placeholder={placeholder} error={error} register={register} currency={currency}/>;
    }

    if (type === "select") {
        return <InputSelect inputName={inputName} dropdownData={dropdownData} register={register} setValue={setValue}/>;
    }
}