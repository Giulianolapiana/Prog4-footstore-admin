import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '../services/usuarios.service';
import { useAuthStore } from '../../../store/useAuthStore';
import type { IUsuario } from '../../auth/types';

export const UsuariosPage = () => {
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuthStore();
    
    // Estado local para el modal de roles
    const [selectedUser, setSelectedUser] = useState<IUsuario | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    // Traer usuarios
    const { data: usuarios = [], isLoading } = useQuery({
        queryKey: ['admin', 'usuarios'],
        queryFn: usuariosService.getUsuarios,
    });

    // Mutación: Asignar Roles
    const rolesMutation = useMutation({
        mutationFn: ({ id, roles }: { id: number; roles: string[] }) => 
        usuariosService.asignarRoles(id, roles),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'usuarios'] });
        setSelectedUser(null);
        }
    });

    // Mutación: Eliminar (Soft Delete)
    const deleteMutation = useMutation({
        mutationFn: usuariosService.eliminarUsuario,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'usuarios'] })
    });

    const handleOpenRolesModal = (u: IUsuario) => {
        setSelectedUser(u);
        setSelectedRoles(u.roles.map(r => r.codigo));
    };

    const handleSaveRoles = () => {
        if (selectedUser) {
        rolesMutation.mutate({ id: selectedUser.id, roles: selectedRoles });
        }
    };

    if (isLoading) return <div className="p-6">Cargando personal...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Personal</h1>
            <p className="text-gray-500">Asigna roles o da de baja a los usuarios del sistema.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Roles Actuales</th>
                <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{u.nombre} {u.apellido}</td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                        {u.roles.map(r => (
                        <span key={r.codigo} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">
                            {r.codigo}
                        </span>
                        ))}
                    </div>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                    <button 
                        onClick={() => handleOpenRolesModal(u)}
                        disabled={u.id === currentUser?.id} // No se puede cambiar roles a sí mismo
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                        Permisos
                    </button>
                    <button 
                        onClick={() => { if(confirm('¿Dar de baja?')) deleteMutation.mutate(u.id) }}
                        disabled={u.id === currentUser?.id || u.id === 1} // No borrar al superadmin
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                        Baja
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* Modal rapidísimo para asignar roles */}
        {selectedUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
                <h3 className="font-bold text-lg mb-4">Roles de {selectedUser.nombre}</h3>
                <div className="flex flex-col gap-3 mb-6">
                {['ADMIN', 'STOCK', 'PEDIDOS', 'CLIENT'].map(rol => (
                    <label key={rol} className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={selectedRoles.includes(rol)}
                        onChange={(e) => {
                        if(e.target.checked) setSelectedRoles([...selectedRoles, rol]);
                        else setSelectedRoles(selectedRoles.filter(r => r !== rol));
                        }}
                        className="w-4 h-4 text-primary focus:ring-primary rounded border-gray-300"
                    />
                    <span className="text-gray-700">{rol}</span>
                    </label>
                ))}
                </div>
                <div className="flex justify-end gap-2">
                <button onClick={() => setSelectedUser(null)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button onClick={handleSaveRoles} disabled={rolesMutation.isPending || selectedRoles.length === 0} className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50">
                    Guardar
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};