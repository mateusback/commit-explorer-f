import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AuthService from '../../services/AuthService';
import BaseHttpClient, { setAuthToken } from '../../services/BaseHttpClient';
import { NotificationService } from '../../services/NotificationService';

const STORAGE_KEY = 'ce_auth_token';

const AuthContext = createContext({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => {},
    register: async () => {},
    logout: () => {},
    hasRole: () => false,
});

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem(STORAGE_KEY);
            const savedUser = localStorage.getItem('ce_user_info');
            
            if (savedToken) {
                setToken(savedToken);
                setAuthToken(savedToken);
                
                if (savedUser) {
                    try {
                        setUser(JSON.parse(savedUser));
                    } catch (error) {
                        console.warn('Erro ao carregar informações do usuário:', error);
                        localStorage.removeItem('ce_user_info');
                    }
                }
                
                // Tentar buscar informações atualizadas do usuário
                try {
                    const userInfo = await AuthService.getCurrentUser();
                    setUser(userInfo);
                    localStorage.setItem('ce_user_info', JSON.stringify(userInfo));
                } catch (error) {
                    // Se falhar, manter usuário salvo ou limpar se token inválido
                    if (error.status === 401) {
                        logout();
                        return;
                    }
                }
            }
            setIsLoading(false);
        };
        
        initAuth();
    }, []);

    const login = async (credentials) => {
        const result = await AuthService.login(credentials);
        if (result && result.accessToken) {
            localStorage.setItem(STORAGE_KEY, result.accessToken);
            setToken(result.accessToken);
            setAuthToken(result.accessToken);
            
            // Buscar informações do usuário após login
            try {
                const userInfo = await AuthService.getCurrentUser();
                setUser(userInfo);
                localStorage.setItem('ce_user_info', JSON.stringify(userInfo));
            } catch (error) {
                console.warn('Erro ao buscar informações do usuário:', error);
            }
            
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
        localStorage.removeItem('ce_user_info');
        setToken(null);
        setUser(null);
        setAuthToken(null);
        NotificationService.info('Você saiu da aplicação.');
    };

    const hasRole = (role) => {
        if (!user || !user.roles) return false;
        return user.roles.includes(role) || user.role === role;
    };

    const value = useMemo(() => {
        const isAuthenticated = Boolean(token);
        return {
            token,
            user,
            isAuthenticated,
            isLoading,
            login,
            register,
            logout,
            hasRole,
        };
    }, [token, user, isLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
