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
