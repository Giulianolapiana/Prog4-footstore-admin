// Tipos propios de la feature de Pedidos (Admin)
import type { IUsuario } from '../auth/types';

export type EstadoPedidoCodigo =
    | 'PENDIENTE'
    | 'CONFIRMADO'
    | 'EN_PREP'
    | 'EN_CAMINO'
    | 'ENTREGADO'
    | 'CANCELADO';

export interface IEstadoPedido {
    id: number;
    codigo: EstadoPedidoCodigo;
    nombre: string;
}

export interface IDetallePedido {
    id: number;
    producto_id: number;
    producto_nombre: string;
    producto_precio: number;
    cantidad: number;
    subtotal: number;
}

export interface IFormaPago {
    id: number;
    codigo: string;
    nombre: string;
}

export interface IDireccionEntrega {
    id: number;
    calle: string;
    numero: string;
    piso?: string;
    depto?: string;
    ciudad: string;
    codigo_postal?: string;
    alias: string;
    es_principal: boolean;
}

export interface IPedido {
    id: number;
    usuario_id: number;
    usuario?: IUsuario;
    estado_actual: IEstadoPedido;
    forma_pago: IFormaPago;
    direccion_entrega: IDireccionEntrega;
    detalles: IDetallePedido[];
    total: number;
    created_at: string;
}
