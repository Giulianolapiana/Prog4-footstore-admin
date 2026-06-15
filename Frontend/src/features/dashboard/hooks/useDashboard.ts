import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useResumenKpis = () => {
    return useQuery({
        queryKey: ['dashboard', 'resumen'],
        queryFn: () => dashboardApi.getResumen(),
        refetchInterval: 30000,
    });
};

export const useVentasPeriodo = (desde: string, hasta: string, agrupacion: 'day'|'week'|'month' = 'day') => {
    return useQuery({
        queryKey: ['dashboard', 'ventas', desde, hasta, agrupacion],
        queryFn: () => dashboardApi.getVentasPeriodo(desde, hasta, agrupacion),
    });
};

export const useProductosTop = (limit: number = 5) => {
    return useQuery({
        queryKey: ['dashboard', 'productos-top', limit],
        queryFn: () => dashboardApi.getProductosTop(limit),
    });
};

export const usePedidosPorEstado = () => {
    return useQuery({
        queryKey: ['dashboard', 'pedidos-estado'],
        queryFn: () => dashboardApi.getPedidosPorEstado(),
        refetchInterval: 15000,
    });
};

export const useIngresosPorFormaPago = (desde?: string, hasta?: string) => {
    return useQuery({
        queryKey: ['dashboard', 'ingresos', desde, hasta],
        queryFn: () => dashboardApi.getIngresosPorFormaPago(desde, hasta),
    });
};
