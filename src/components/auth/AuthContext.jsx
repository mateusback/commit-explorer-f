import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AuthService from '../../services/AuthService';
import BaseHttpClient, { setAuthToken } from '../../services/BaseHttpClient';
import { NotificationService } from '../../services/NotificationService';

const STORAGE_KEY = 'ce_auth_token';

const AuthContext = createContext({
    token: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => {},
    register: async () => {},
    logout: () => {},
});

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setToken(saved);
            setAuthToken(saved);
        }
        setIsLoading(false);
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

    const value = useMemo(() => {
        const isAuthenticated = Boolean(token);
        return {
            token,
            isAuthenticated,
            isLoading,
            login,
            register,
            logout,
        };
    }, [token, isLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
