import { api } from '../../../shared/api/axios';
import type { IUsuario } from '../../../shared/types';

export const usuariosService = {
    getUsuarios: async (): Promise<IUsuario[]> => {
        const { data } = await api.get<IUsuario[]>('/admin/usuarios');
        return data;
    },

    asignarRoles: async (usuarioId: number, rolesCodigos: string[]): Promise<IUsuario> => {
        const { data } = await api.post<IUsuario>(`/admin/usuarios/${usuarioId}/roles`, {
        roles_codigos: rolesCodigos
        });
        return data;
    },

    eliminarUsuario: async (usuarioId: number): Promise<void> => {
        await api.delete(`/admin/usuarios/${usuarioId}`);
    }
};