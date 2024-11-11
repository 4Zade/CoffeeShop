import { createContext, useContext, useState } from "react";

interface AlertContextProps {
    alert: {
        success?: {
            message: string;
        };
        error?: {
            message: string;
        };
    };

    modal: string | null;
    action: "" | "add" | "edit";

    successAlert: (message: string) => void;
    errorAlert: (message: string) => void;

    adminModal: () => void;
    discountModal: () => void;
    productModal: (action: "" | "add" | "edit") => void;

    closeModal: () => void;
}

const defaultContextValue: AlertContextProps = {
    alert: {},

    modal: '',
    action: '',

    successAlert: async () => {},
    errorAlert: async () => {},

    adminModal: async () => {},
    discountModal: async () => {},
    productModal: async () => {},

    closeModal: async () => {},
};

export const AlertContext = createContext<AlertContextProps>(defaultContextValue);

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [alert, setAlert] = useState<AlertContextProps["alert"]>(defaultContextValue.alert);
    const [modal, setModal] = useState<AlertContextProps["modal"]>(defaultContextValue.modal);
    const [action, setAction] = useState<"" | "add" | "edit">('');

    const successAlert = async (message: string) => {
        console.log('Success command ran')
        setAlert({
            success: { message },
        });

        const timer = setTimeout(() => {
            setAlert({});
        }, 5000)

        return () => clearTimeout(timer);
    };

    const errorAlert = async (message: string) => {
        setAlert({
            error: { message },
        });

        const timer = setTimeout(() => {
            setAlert({});
        }, 5000)

        return () => clearTimeout(timer);
    };

    const adminModal = async () => {
        if (modal === 'admin') {
            return setModal(null);
        }
        console.log('admin modal');
        return setModal('admin');
    };

    const discountModal = async () => {
        if (modal === 'discount') {
            return setModal(null);
        }

        return setModal('discount');
    };

    const productModal = async (action: "" | "add" | "edit") => {
        if (modal === 'product') {
            setAction('');
            return setModal(null);
        }

        setAction(action);
        return setModal('product');
    };

    const closeModal = async () => {
        setAction('');
        return setModal(null);
    };

    return (
        <AlertContext.Provider value={{ alert, modal, successAlert, errorAlert, adminModal, discountModal, productModal, closeModal, action }}>
            {children}
        </AlertContext.Provider>
    );
};

const useAlert = () => useContext(AlertContext);

export { AlertProvider, useAlert };
