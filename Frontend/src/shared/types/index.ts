/**
 * Tipos COMPARTIDOS entre múltiples features del Admin.
 * Los tipos específicos de cada dominio ahora viven en su feature:
 *
 *   features/auth/types.ts        → IRol, IUsuario, ILoginRequest
 *   features/categorias/types.ts  → ICategoria
 *   features/ingredientes/types.ts → IIngrediente
 *   features/productos/types.ts   → IProducto
 *   features/pedidos/types.ts     → IPedido, IDetallePedido, IFormaPago, IDireccionEntrega, IEstadoPedido, EstadoPedidoCodigo
 */

// ── Paginación Genérica (compartida entre features) ──
export interface IPaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

// Re-exportaciones para compatibilidad con imports anteriores
export type { IRol, IUsuario, ILoginRequest } from '../../features/auth/types';
export type { ICategoria } from '../../features/categorias/types';
export type { IIngrediente } from '../../features/ingredientes/types';
export type { IProducto } from '../../features/productos/types';
export type {
    EstadoPedidoCodigo,
    IEstadoPedido,
    IDetallePedido,
    IFormaPago,
    IDireccionEntrega,
    IPedido,
} from '../../features/pedidos/types';