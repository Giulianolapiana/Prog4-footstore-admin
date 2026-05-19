import { createBrowserRouter } from 'react-router-dom';
import { CategoriasPage } from '../features/categorias/pages/CategoriasPage';
import { ProductosPage } from '../features/productos/pages/ProductosPage';
import { ProductoDetallePage } from '../features/productos/pages/ProductoDetallePage';
import { IngredientesPage } from '../features/ingredientes/pages/IngredientesPage';
import { AdminLayout } from '../shared/components/AdminLayout';
import { AdminLoginPage } from '../features/auth/pages/AdminLoginPage';
import { AdminDashboardPage } from '../features/dashboard/pages/AdminDashboardPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: 'productos',
        element: <ProductosPage />,
      },
      {
        path: 'productos/detalle/:id',
        element: <ProductoDetallePage />,
      },
      {
        path: 'categorias',
        element: <CategoriasPage />,
      },
      {
        path: 'ingredientes',
        element: <IngredientesPage />,
      },
      {
        path: 'pedidos',
        element: (
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Pedidos</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">Próximamente...</p>
          </div>
        ),
      },
    ],
  },
]);
