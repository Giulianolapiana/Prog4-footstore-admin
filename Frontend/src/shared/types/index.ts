export interface ICategoria {
    id?: number;
    nombre: string;
    descripcion?: string;
    imagen_url?: string;
    parent_id?: number;
}

export interface IIngrediente {
    id?: number;
    nombre: string;
    descripcion?: string;
    es_alergeno?: boolean;
}

export interface IProducto {
    id?: number;
    nombre: string;
    descripcion?: string;
    precio_base: number;
    stock_cantidad?: number;
    disponible?: boolean;
    imagenes_url?: string[];
    categoria_ids?: number[];
    ingrediente_ids?: number[];
    categorias?: ICategoria[];
    ingredientes?: IIngrediente[];
}

// ── Auth & Usuarios ──
export interface IRol {
    id: number;
    codigo: 'ADMIN' | 'STOCK' | 'PEDIDOS' | 'CLIENT';
    nombre: string;
}

export interface IUsuario {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    is_active: boolean;
    roles: IRol[];
}

export interface ILoginRequest {
    email: string;
    password: string;
}

// ── Pedidos  ──
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

// ── Paginación Genérica ──
export interface IPaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}