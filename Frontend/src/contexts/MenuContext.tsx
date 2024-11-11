import { createContext, useContext, useState, useCallback } from "react";

interface MenuContextProps {
    open: boolean;
    toggle: () => void;
}

const defaultContextValue: MenuContextProps = {
    open: false,
    toggle: () => { }
};

export const MenuContext = createContext<MenuContextProps>(defaultContextValue);

const MenuProvider = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState<boolean>(false);

    const toggle = useCallback(() => {
        setOpen(!open);
    }, [open]);

    return (
        <MenuContext.Provider value={{ open, toggle }}>
            {children}
        </MenuContext.Provider>
    );
};

const useMenu = () => useContext(MenuContext);

// eslint-disable-next-line react-refresh/only-export-components
export { MenuProvider, useMenu };
