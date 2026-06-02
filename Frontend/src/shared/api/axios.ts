import axios from 'axios';

// Apuntar a la ruta /api/v1 que config en el backend
const API_URL = import.meta.env.VITE_API_URL + '/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // CRÍTICO: Esto hace que el navegador envíe la cookie httpOnly automáticamente
    withCredentials: true,
});

//Request Interceptor 
api.interceptors.request.use(
    (config) => {
        // Ya NO mandamos el token manual acá, la cookie viaja sola.
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (Manejo de Errores)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Si la cookie expiró o es inválida, evitamos loop infinito si ya estamos en /login
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    console.error('No tenés permisos para esta acción (RBAC)');
                    break;
            }
        }
        return Promise.reject(error);
    }
);
