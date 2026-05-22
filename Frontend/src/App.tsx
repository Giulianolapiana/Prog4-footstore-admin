import { RouterProvider } from 'react-router-dom';
import { router } from './router/AppRouter';
import { useCheckAuth } from './features/auth/hooks/useAuth';

function App() {
    useCheckAuth();
    return <RouterProvider router={router} />;
}

export default App;