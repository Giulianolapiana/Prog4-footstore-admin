import axios from 'axios';
import { api } from '../../../shared/api/axios';
import type { IImage } from '../types';

// Sube al backend y devuelve la URL final de Cloudinary
export const uploadImages = async (files: File[]): Promise<IImage[]> => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append("files", file); // Backend espera "files" en plural
    });

    const API_URL = import.meta.env.VITE_API_URL + '/api/v1';

    // Usamos axios puro para evitar el override de Content-Type: application/json
    const { data } = await axios.post(`${API_URL}/images/upload`, formData, {
        withCredentials: true
    });
    return data;
};

// Elimina una imagen del CDN y de la base de datos
export const deleteImage = async (public_id: string): Promise<void> => {
    await api.delete(`/images/${encodeURIComponent(public_id)}`);
};