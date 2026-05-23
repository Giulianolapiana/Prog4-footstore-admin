import { useAuthStore } from '../../store/useAuthStore';

export const usePermissions = () => {
    const { isAdmin, hasRole } = useAuthStore();

    return {
        // ── Usuarios ──
        canManageUsers: isAdmin(), // Solo ADMIN puede crear/editar/borrar usuarios

        // ── Productos ──
        canCreateProduct: isAdmin(), // Solo ADMIN crea productos nuevos
        canEditProduct: isAdmin() || hasRole('STOCK'), // STOCK puede editar (ej: cambiar precios o cantidad)
        canDeleteProduct: isAdmin(), // Solo ADMIN borra

        // ── Categorías e Ingredientes ──
        canManageCategories: isAdmin(),
        canManageIngredients: isAdmin(),

        // ── Pedidos ──
        canManageOrders: isAdmin() || hasRole('PEDIDOS'), // PEDIDOS puede avanzar estados
        canCancelOrders: isAdmin(), // Solo ADMIN puede cancelar un pedido de la nada
    };
};