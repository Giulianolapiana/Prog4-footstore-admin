import { api } from "../../../shared/api/axios";
import type { ICategoria } from "../../../shared/types";

const BASE_URL = '/categorias';

export const getCategorias = async (): Promise<ICategoria[]> => {
  const { data } = await api.get<ICategoria[]>(BASE_URL);
  return data;
};

export const getCategoria = async (id: number): Promise<ICategoria> => {
  const { data } = await api.get<ICategoria>(`${BASE_URL}/${id}`);
  return data;
};

export const createCategoria = async (newCategoria: Omit<ICategoria, "id">): Promise<ICategoria> => {
  const { data } = await api.post<ICategoria>(BASE_URL, newCategoria);
  return data;
};

export const updateCategoria = async (id: number, categoria: Omit<ICategoria, "id">): Promise<ICategoria> => {
  const { data } = await api.put<ICategoria>(`${BASE_URL}/${id}`, categoria);
  return data;
};

export const deleteCategoria = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};
