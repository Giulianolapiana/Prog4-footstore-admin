import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useAuthStore();
    
  // Mientras verifica la cookie con el backend, mostramos un spinner
    if (isLoading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
        );
    }

    // Si terminó de cargar y no está autenticado, lo mandamos al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si está todo OK, renderiza la ruta hija
    return <Outlet />;
};
