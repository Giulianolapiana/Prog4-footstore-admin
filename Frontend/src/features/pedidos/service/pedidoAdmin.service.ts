import { api } from '../../../shared/api/axios';
import type { IPedido, EstadoPedidoCodigo } from '../types';

export const pedidoAdminService = {
    // Trae todos los pedidos del sistema (como es Admin/Pedidos, el backend devuelve todo)
    getPedidos: async (): Promise<IPedido[]> => {
        const { data } = await api.get<IPedido[]>('/pedidos/');
        return data;
    },

    // Avanza el estado usando el PATCH que creamos
    avanzarEstado: async (pedidoId: number, estadoCodigo: EstadoPedidoCodigo): Promise<IPedido> => {
        const { data } = await api.patch<IPedido>(`/pedidos/${pedidoId}/estado`, {
        estado_codigo: estadoCodigo,
        });
        return data;
    },

    // Cancela el pedido directamente
    cancelarPedido: async (pedidoId: number): Promise<IPedido> => {
        const { data } = await api.patch<IPedido>(`/pedidos/${pedidoId}/cancelar`);
        return data;
    },
};