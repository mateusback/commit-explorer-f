import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RoleProtectedRoute({ children, requiredRole, fallbackPath = '/dashboard' }) {
    const { isAuthenticated, hasRole, isLoading } = useAuth();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to fallback path if user doesn't have required role
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to={fallbackPath} replace />;
    }

    return children;
}