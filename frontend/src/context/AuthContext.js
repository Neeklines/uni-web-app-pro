import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const refreshUser = useCallback(
        async () => {
            if (!token)
                return;

            try {

                const userData =
                    await authService.getMe(token);

                setUser(userData);

            } catch (err) {

                console.error(err);
                logout();
            }
        },
        [token]
    );

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        localStorage.setItem('token', data.access_token);

        setToken(data.access_token);
    };

    const register = async (email, password) => {
        await authService.register(email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);