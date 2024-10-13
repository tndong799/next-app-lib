'use client';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import Cookies from 'js-cookie';

type User = {
    id: number;
    name: string;
};

type AppContextType = {
    isAuthenticated: boolean;
    user: null | User;
    loading: boolean;
    login: () => void;
    logout: () => void;
};

const AppContext = createContext<AppContextType>({
    isAuthenticated: false,
    user: null,
    loading: true,
    login: () => {},
    logout: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<null | User>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUserFromCookies() {
            const token = Cookies.get('token');
            if (token) {
                console.log(
                    "Got a token in the cookies, let's see if it is valid"
                );
                // api.defaults.headers.Authorization = `Bearer ${token}`
                // const { data: user } = await api.get('users/me')
                // if (user) setUser(user);

                setUser({
                    id: 1,
                    name: 'ngoc dong',
                });
            }
            setLoading(false);
        }
        loadUserFromCookies();
    }, []);

    const login = async () => {
        const token = 'ngocdong';
        if (token) {
            Cookies.set('token', token, { expires: 60 });
            // api.defaults.headers.Authorization = `Bearer ${token.token}`
            // const { data: user } = await api.get('users/me')
            setUser({
                id: 1,
                name: 'ngoc dong',
            });
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        window.location.pathname = '/auth/login';
    };

    return (
        <AppContext.Provider
            value={{ isAuthenticated: !!user, user, loading, login, logout }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default function useApp() {
    const context = useContext(AppContext);
    return context;
}
