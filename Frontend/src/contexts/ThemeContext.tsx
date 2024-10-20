import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthProvider } from "./AuthContext";

interface ThemeContextProps {
    theme: string;
    setTheme?: (theme: string) => void;
    toggleTheme?: () => void;
}

const defaultContextValue: ThemeContextProps = {
    theme: 'light',
};

export const ThemeContext = createContext<ThemeContextProps>(defaultContextValue);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<string>("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeContext.Provider>
    );
};

const useTheme = () => useContext(ThemeContext);

// eslint-disable-next-line react-refresh/only-export-components
export { ThemeProvider, useTheme };
