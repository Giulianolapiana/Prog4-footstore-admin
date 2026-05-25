import { createBrowserRouter } from "react-router-dom";
import { CategoriasPage } from "../features/categorias/pages/CategoriasPage";
import { ProductosPage } from "../features/productos/pages/ProductosPage";
import { ProductoDetallePage } from "../features/productos/pages/ProductoDetallePage";
import { IngredientesPage } from "../features/ingredientes/pages/IngredientesPage";
import { AdminLayout } from "../shared/components/AdminLayout";
import { AdminLoginPage } from "../features/auth/pages/AdminLoginPage";
import { AdminDashboardPage } from "../features/dashboard/pages/AdminDashboardPage";
import { PedidosPage } from '../features/pedidos/pages/PedidosPage';
import { UsuariosPage } from '../features/usuarios/pages/UsuariosPage';

// protegemos las rutas con componentes que verifican autenticación y roles
import { PrivateRoute } from "../shared/components/PrivateRoute";
import { RoleGuard } from "../shared/components/RoleGuard";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <AdminLoginPage />,
    },
    {
        // ── 1. Capa de Autenticación: Si no hay cookie/sesión, rebota al login ──
        element: <PrivateRoute />,
        children: [
        {
            path: "/",
            element: <AdminLayout />,
            children: [
            // ── Visible para cualquier empleado logueado (Dashboard genérico) ──
            {
                index: true,
                element: <AdminDashboardPage />,
            },

            // ── 2. Capa de Roles: Solo ADMIN (Tienen CRUD completo) ──
            {
                element: <RoleGuard allowedRoles={["ADMIN"]} />,
                children: [
                {
                    path: "categorias",
                    element: <CategoriasPage />,
                },
                {
                    path: "ingredientes",
                    element: <IngredientesPage />,
                },
                {
                    path: "usuarios",
                    element: <UsuariosPage />,
                },
                ],
            },

            // ── 3. Capa de Roles: ADMIN y STOCK (Gestionan el catálogo) ──
            {
                element: <RoleGuard allowedRoles={["ADMIN", "STOCK"]} />,
                children: [
                {
                    path: "productos",
                    element: <ProductosPage />,
                },
                {
                    path: "productos/detalle/:id",
                    element: <ProductoDetallePage />,
                },
                ],
            },

            // ── 4. Capa de Roles: ADMIN y PEDIDOS (Gestionan ventas y cajero) ──
            {
                element: <RoleGuard allowedRoles={["ADMIN", "PEDIDOS"]} />,
                children: [
                {
                    path: "pedidos",
                    element: <PedidosPage />,
                },
                ],
            },
            ],
        },
        ],
    },
]);
