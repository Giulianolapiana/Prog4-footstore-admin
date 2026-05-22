import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../../../store/useAuthStore';
import type { ILoginRequest } from '../../../shared/types';

// ── 1. Verificar Sesión (Hidratación) ──
export const useCheckAuth = () => {
    const { setUser, logout, setLoading } = useAuthStore();

    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
        try {
            const user = await authService.getMe();
            setUser(user);
            return user;
        } catch (error) {
            logout();
            return null;
        } finally {
            setLoading(false); // Apagamos el spinner del PrivateRoute
        }
        },
        retry: false, // Si falla el /me (ej: no hay cookie), no queremos que reintente
        staleTime: 5 * 60 * 1000, // La data se considera fresca por 5 minutos
    });
};

// ── 2. Login ──
export const useLogin = () => {
    const { setUser } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: ILoginRequest) => authService.login(credentials),
        onSuccess: (user) => {
        setUser(user);
        // Invalida el caché para forzar que otros queries se actualicen si es necesario
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        navigate('/'); // Lo mandamos al dashboard
        },
    });
};

// ── 3. Logout ──
export const useLogout = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
        logout();
        queryClient.clear(); // ¡Limpia TODO el caché de TanStack Query por seguridad!
        navigate('/login');
        },
    });
};