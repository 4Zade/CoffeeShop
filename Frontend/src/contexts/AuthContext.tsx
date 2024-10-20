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
    setAuth?: (status: boolean) => void;
    checkAuth: () => Promise<void>;
    user: UserProps | undefined;
    setUser?: (user: UserProps) => void;
}

const defaultContextValue: AuthContextProps = {
    auth: false,
    checkAuth: async () => { },
    user: undefined,
};

export const AuthContext = createContext<AuthContextProps>(defaultContextValue);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<boolean>(false);
    const [user, setUser] = useState<UserProps | undefined>(undefined);


    const checkAuth = useCallback(async (): Promise<void> => {
        try {
            const response = await axios.get('http://localhost:7000/api/v1/auth/status', { withCredentials: true });
            setAuth(response.data.authorized);
            setUser(response.data.data);
        }
        catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, checkAuth, user }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
