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
        console.log('[AUTH] hasRole verificando:', { role, user, hasRoles: !!user?.roles, hasRole: !!user?.role });
        if (!user) {
            console.log('[AUTH] hasRole: user não existe');
            return false;
        }
        if (!user.roles && !user.role) {
            console.log('[AUTH] hasRole: user não tem roles nem role');
            return false;
        }
        
        // Normalizar a role para lowercase
        const normalizedRole = role.toLowerCase();
        
        // Verificar array de roles
        if (user.roles && Array.isArray(user.roles)) {
            const hasRoleInArray = user.roles.some(r => {
                const normalizedUserRole = r.toLowerCase();
                // Aceita tanto "professor" quanto "ROLE_PROFESSOR"
                return normalizedUserRole === normalizedRole || 
                       normalizedUserRole === `role_${normalizedRole}` ||
                       normalizedUserRole.replace('role_', '') === normalizedRole;
            });
            console.log('[AUTH] hasRole resultado (array):', hasRoleInArray, 'roles:', user.roles);
            if (hasRoleInArray) return true;
        }
        
        // Verificar role única (string)
        if (user.role) {
            const normalizedUserRole = user.role.toLowerCase();
            const result = normalizedUserRole === normalizedRole || 
                          normalizedUserRole === `role_${normalizedRole}` ||
                          normalizedUserRole.replace('role_', '') === normalizedRole;
            console.log('[AUTH] hasRole resultado (string):', result);
            return result;
        }
        
        console.log('[AUTH] hasRole resultado final:', false);
        return false;
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
