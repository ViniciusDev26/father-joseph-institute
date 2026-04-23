import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Login } from './pages/Login';
import { useAuthStore } from './store/useAuthStore';

function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  return token ? <Outlet /> : <Navigate to="/login" />;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <div>Admin Dashboard - Em desenvolvimento</div>,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
