import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

export interface UserProps {
    id: number
    first_name: string
    last_name: string
    email: string
    roles: string[],
    image?: string
    favorite: number[]
}

interface AuthContextProps {
    auth: boolean
    checkAuth: () => Promise<void>;
    user: UserProps | undefined;

    open: boolean;
    toggle: () => void;
    form: "login" | "register";
    changeForm: (form: "login" | 'register') => void;

    logout: () => Promise<void>
}

const defaultContextValue: AuthContextProps = {
    auth: false,
    checkAuth: async () => { },
    user: undefined,

    open: false,
    toggle: async () => { },
    form: 'login',
    changeForm: async () => { },

    logout: async () => { }
};

export const AuthContext = createContext<AuthContextProps>(defaultContextValue);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<boolean>(false);
    const [user, setUser] = useState<UserProps | undefined>(undefined);
    const [open, setOpen] = useState<boolean>(false);
    const [form, setForm] = useState<"login" | 'register'>('login');


    const checkAuth = useCallback(async (): Promise<void> => {
        try {
            const response = await axios.get('/api/v1/auth/status', { withCredentials: true });
            setAuth(response.data.authorized);
            setUser(response.data.data);
        }
        catch (err) {
            console.log(err);
            setAuth(false);
            setUser(undefined);
        }
    }, []);

    const toggle = async () => {
        setOpen(!open);
    }

    const changeForm = async (form: "login" | 'register') => {
        setForm(form);
    }

    const logout = async () => {
        try {
            await axios.post("/api/v1/auth/logout", {}, { withCredentials: true });
            setAuth(false);
            setUser(undefined);
            window.location.href = "/";
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ auth, checkAuth, user, open, toggle, form, changeForm, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
