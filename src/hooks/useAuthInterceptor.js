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
    setGlobalLogout(logout);

    return () => {
      setGlobalLogout(null);
    };
  }, [logout]);
}
