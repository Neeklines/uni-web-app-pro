import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const loadUser = async () => {
            if (!token) return;

            try {
                const userData = await authService.getMe(token);
                setUser(userData);
            } catch (err) {
                console.error(err);
                logout(); // token invalid
            }
        };

        loadUser();
    }, [token]);

    const login = async (email, password, captchaToken) => {
        const data = await authService.login(email, password, captchaToken);
        localStorage.setItem('token', data.access_token);

        setToken(data.access_token);
    };

    const register = async (email, password, captchaToken) => {
        await authService.register(email, password, captchaToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);