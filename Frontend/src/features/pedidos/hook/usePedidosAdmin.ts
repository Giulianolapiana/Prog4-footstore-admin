import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pedidoAdminService } from '../service/pedidoAdmin.service';
import type { EstadoPedidoCodigo } from '../types';

export const usePedidosAdmin = () => {
    const queryClient = useQueryClient();

    // Query para listar pedidos con auto-refresco (polling) cada 15 segundos
    const pedidosQuery = useQuery({
        queryKey: ['admin', 'pedidos'],
        queryFn: pedidoAdminService.getPedidos,
        refetchInterval: 15000, 
    });

    // Mutación para cambiar de estado (Tablero Kanban)
    const avanzarEstadoMutation = useMutation({
        mutationFn: ({ id, nuevoEstado }: { id: number; nuevoEstado: EstadoPedidoCodigo }) =>
        pedidoAdminService.avanzarEstado(id, nuevoEstado),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'pedidos'] });
        },
    });

    // Mutación para cancelar
    const cancelarMutation = useMutation({
        mutationFn: (id: number) => pedidoAdminService.cancelarPedido(id),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'pedidos'] });
        },
    });

    return {
        pedidos: pedidosQuery.data || [],
        isLoading: pedidosQuery.isLoading,
        isError: pedidosQuery.isError,
        avanzarEstado: avanzarEstadoMutation.mutate,
        isModifying: avanzarEstadoMutation.isPending || cancelarMutation.isPending,
        cancelarPedido: cancelarMutation.mutate,
    };
};