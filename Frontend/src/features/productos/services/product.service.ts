import type { IProducto } from '../types';
import { api } from "../../../shared/api/axios";

export const getProductos = async (): Promise<IProducto[]> => {
  const { data } = await api.get<IProducto[]>("/productos");
  return data;
};

export const getProducto = async (id: number): Promise<IProducto> => {
  const { data } = await api.get<IProducto>(`/productos/${id}`);
  return data;
};

export const createProducto = async (
  newProducto: Omit<IProducto, "id">
): Promise<IProducto> => {
  const { data } = await api.post<IProducto>("/productos/", newProducto);
  return data;
};

export const updateProducto = async (
  id: number,
  producto: Omit<IProducto, "id">
): Promise<IProducto> => {
  const { data } = await api.put<IProducto>(`/productos/${id}`, producto);
  return data;
};

export const deleteProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`);
};
