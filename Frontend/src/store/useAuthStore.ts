import { create } from 'zustand';
import type { IUsuario, IRol } from '../shared/types';

interface AuthState {
    user: IUsuario | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    // Acciones
    setUser: (user: IUsuario) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    // Helpers de permisos
    hasRole: (codigo: IRol['codigo']) => boolean;
    isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Empieza cargando para verificar la sesión al abrir la app

    setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
    logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
    setLoading: (isLoading) => set({ isLoading }),

    hasRole: (codigo) => {
        const { user } = get();
        if (!user || !user.roles) return false;
        return user.roles.some((r) => r.codigo === codigo);
    },

    isAdmin: () => get().hasRole('ADMIN'),
}));