import { useEffect } from 'react';
import { useAuth } from '../components/auth/AuthContext';

let globalLogout = null;

export function setGlobalLogout(logoutFn) {
  globalLogout = logoutFn;
}

export function getGlobalLogout() {
  return globalLogout;
}

export function useAuthInterceptor() {
  const { logout } = useAuth();

  useEffect(() => {
    // Registrar a função de logout globalmente
    setGlobalLogout(logout);

    // Cleanup ao desmontar
    return () => {
      setGlobalLogout(null);
    };
  }, [logout]);
}
