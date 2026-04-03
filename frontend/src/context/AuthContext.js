import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            setUser({ email: 'mock@example.com' }); // TODO: replace with /api/me
        }
    }, [token]);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        localStorage.setItem('token', data.access_token);

        setToken(data.access_token);
        setUser({ email });
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
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);