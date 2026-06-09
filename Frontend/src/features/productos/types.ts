// Tipos propios de la feature de Productos
import type { ICategoria } from '../categorias/types';
import type { IIngrediente } from '../ingredientes/types';

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
