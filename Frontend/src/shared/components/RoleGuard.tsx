import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import type { IRol } from '../types';

interface RoleGuardProps {
    allowedRoles: IRol['codigo'][];
    fallbackPath?: string;
}

export const RoleGuard = ({ allowedRoles, fallbackPath = '/' }: RoleGuardProps) => {
    const { user, isLoading } = useAuthStore();

    if (isLoading) return null;

    // Verificamos si alguno de los roles del usuario está en la lista de permitidos
    const hasPermission = user?.roles?.some((role) =>
        allowedRoles.includes(role.codigo)
    );

    // Si no tiene permiso, lo mandamos al dashboard (o la ruta que le pases)
    if (!hasPermission) {
        return <Navigate to={fallbackPath} replace />;
    }

    return <Outlet />;
};