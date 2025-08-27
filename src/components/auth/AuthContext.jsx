import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AuthService from '../../services/AuthService';
import BaseHttpClient, { setAuthToken } from '../../services/BaseHttpClient';
import { NotificationService } from '../../services/NotificationService';

const STORAGE_KEY = 'ce_auth_token';

const AuthContext = createContext({
    token: null,
    isAuthenticated: false,
    login: async () => {},
    register: async () => {},
    logout: () => {},
});

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setToken(saved);
            setAuthToken(saved);
        }
    }, []);

    const login = async (credentials) => {
        const result = await AuthService.login(credentials);
        if (result && result.accessToken) {
            localStorage.setItem(STORAGE_KEY, result.accessToken);
            setToken(result.accessToken);
            setAuthToken(result.accessToken);
            NotificationService.success('Login realizado com sucesso.');
        }
        return result;
    };

    const register = async (payload) => {
        const result = await AuthService.register(payload);
        NotificationService.success('Registro realizado. Faça login para continuar.');
        return result;
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setAuthToken(null);
        NotificationService.info('Você saiu da aplicação.');
    };

    const value = useMemo(() => ({
        token,
        isAuthenticated: Boolean(token),
        login,
        register,
        logout,
    }), [token]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
