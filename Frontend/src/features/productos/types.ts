import type { ICategoria } from '../categorias/types';
import type { IIngrediente } from '../ingredientes/types';

export interface IUnidadMedida {
    id: number;
    nombre: string;
    simbolo: string;
    tipo: string;
}

export interface IProductoIngrediente {
    es_removible: boolean;
    es_opcional: boolean;
    cantidad: string | number;
    unidad_medida?: IUnidadMedida;
    ingrediente: IIngrediente;
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
    producto_ingredientes?: IProductoIngrediente[];
}

export interface IImage {
    id: number;
    public_id: string;
    url: string;
    filename?: string;
    width?: number;
    height?: number;
    format?: string;
}