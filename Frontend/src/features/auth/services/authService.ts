import { api } from '../../../shared/api/axios';
import type { ILoginRequest, IUsuario } from '../types';

export const authService = {
    login: async (credentials: ILoginRequest): Promise<IUsuario> => {
        // Fijate que acá ya no manejamos el token, ¡la cookie hace la magia sola!
        const { data } = await api.post<IUsuario>('/auth/login', credentials);
        return data;
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },

    getMe: async (): Promise<IUsuario> => {
        const { data } = await api.get<IUsuario>('/auth/me');
        return data;
    },
};