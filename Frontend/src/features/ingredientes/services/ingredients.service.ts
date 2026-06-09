import type { IIngrediente } from '../types';
import { api } from "../../../shared/api/axios";

export const getIngredientes = async (): Promise<IIngrediente[]> => {
  const { data } = await api.get<IIngrediente[]>("/ingredientes");
  return data;
};

export const getIngrediente = async (id: number): Promise<IIngrediente> => {
  const { data } = await api.get<IIngrediente>(`/ingredientes/${id}`);
  return data;
};

export const createIngrediente = async (
  newIngrediente: Omit<IIngrediente, "id">
): Promise<IIngrediente> => {
  const { data } = await api.post<IIngrediente>("/ingredientes", newIngrediente);
  return data;
};

export const updateIngrediente = async (
  id: number,
  ingrediente: Omit<IIngrediente, "id">
): Promise<IIngrediente> => {
  const { data } = await api.put<IIngrediente>(`/ingredientes/${id}`, ingrediente);
  return data;
};

export const deleteIngrediente = async (id: number): Promise<void> => {
  await api.delete(`/ingredientes/${id}`);
};
