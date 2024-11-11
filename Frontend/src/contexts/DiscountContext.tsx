import { createContext, useContext, useState } from "react";

interface DiscountContextProps {
    action: string;
    currentCode: {
        code: string;
        percentage: number;
        description: string;
    };
    addDiscount: () => void;
    editDiscount: (code: { code: string; percentage: number; description: string; }) => void;
    finishAction: () => void;
    cancelAction: () => void;
}

const defaultContextValue: DiscountContextProps = {
    action: 'list',
    currentCode: {
        code: '',
        percentage: 0,
        description: '',
    },
    addDiscount: async () => {},
    editDiscount: async () => {},
    finishAction: () => {},
    cancelAction: () => {},
};

export const DiscountContext = createContext<DiscountContextProps>(defaultContextValue);

const DiscountProvider = ({ children }: { children: React.ReactNode }) => {
    const [action, setAction] = useState('list');
    const [currentCode, setCurrentCode] = useState(defaultContextValue.currentCode);

    const addDiscount = async () => {
        try {
            setAction('add');
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    const editDiscount = async (code: { code: string; percentage: number; description: string; }) => {
        try {
            setAction('edit');
            setCurrentCode(code);
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    const finishAction = () => {
        setAction('list');
    }

    const cancelAction = () => {
        setAction('list');
        setCurrentCode(defaultContextValue.currentCode);
    }

    return (
        <DiscountContext.Provider value={{ action, currentCode, addDiscount, editDiscount, finishAction, cancelAction }}>
            {children}
        </DiscountContext.Provider>
    );
};

const useDiscount = () => useContext(DiscountContext);

// eslint-disable-next-line react-refresh/only-export-components
export { DiscountProvider, useDiscount };
