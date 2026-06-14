import { api } from '../../../shared/api/axios';
import type { IImage } from '../types';

// Sube  al backend y devuelve la URL final de Cloudinary
export const uploadImages = async (files: File[]): Promise<IImage[]> => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append("files", file);
    });

    const { data } = await api.post('/api/v1/images/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
};

// Elimina una imagen del CDN y de la base de datos
export const deleteImage = async (public_id: string): Promise<void> => {
    await api.delete(`/api/v1/uploads/imagen/${encodeURIComponent(public_id)}`);
};