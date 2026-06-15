export interface ResumenResponse {
    ventas_hoy: number;
    ticket_promedio: number;
    pedidos_activos: number;
    ventas_mes_actual: number;
}

export interface VentasPeriodoItem {
    periodo: string;
    total_ventas: number;
    cantidad_pedidos: number;
}

export interface ProductoTopItem {
    nombre: string;
    cantidad_vendida: number;
    ingresos: number;
}

export interface PedidosEstadoItem {
    estado_codigo: string;
    cantidad: number;
}

export interface FormaPagoIngresoItem {
    forma_pago_codigo: string;
    total: number;
}

export interface IngresosResponse {
    ingresos_por_forma_pago: FormaPagoIngresoItem[];
}
