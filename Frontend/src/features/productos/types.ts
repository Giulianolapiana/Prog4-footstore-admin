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

export interface IImage {
    public_id: string;
    secure_url: string;
    width?: number;
    height?: number;
    format?: string;
    resource_type?: string;
}