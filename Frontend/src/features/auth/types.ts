// Tipos propios de la feature de Auth / Usuarios

export interface IRol {
    id: number;
    codigo: 'ADMIN' | 'STOCK' | 'PEDIDOS' | 'CLIENT';
    nombre: string;
}

export interface IUsuario {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    is_active: boolean;
    roles: IRol[];
}

export interface ILoginRequest {
    email: string;
    password: string;
}
