import { api } from '../../../shared/api/axios';
import type {
    ResumenResponse,
    VentasPeriodoItem,
    ProductoTopItem,
    PedidosEstadoItem,
    IngresosResponse
} from '../types';

export const dashboardApi = {
    getResumen: async (): Promise<ResumenResponse> => {
        const response = await api.get('/estadisticas/resumen');
        return response.data;
    },
    
    getVentasPeriodo: async (desde: string, hasta: string, agrupacion: 'day' | 'week' | 'month' = 'day'): Promise<VentasPeriodoItem[]> => {
        const response = await api.get('/estadisticas/ventas', {
            params: { desde, hasta, agrupacion }
        });
        return response.data;
    },

    getProductosTop: async (limit: number = 5): Promise<ProductoTopItem[]> => {
        const response = await api.get('/estadisticas/productos-top', {
            params: { limit }
        });
        return response.data;
    },

    getPedidosPorEstado: async (): Promise<PedidosEstadoItem[]> => {
        const response = await api.get('/estadisticas/pedidos-por-estado');
        return response.data;
    },

    getIngresosPorFormaPago: async (desde?: string, hasta?: string): Promise<IngresosResponse> => {
        const response = await api.get('/estadisticas/ingresos', {
            params: { desde, hasta }
        });
        return response.data;
    }
};
