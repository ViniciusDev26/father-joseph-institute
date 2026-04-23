import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { ArtisanList } from './pages/artisans/ArtisanList';
import { ArtisanCreate } from './pages/artisans/ArtisanCreate';
import { EventList } from './pages/events/EventList';
import { EventCreate } from './pages/events/EventCreate';
import { ProductList } from './pages/products/ProductList';
import { ProductCreate } from './pages/products/ProductCreate';
import { VolunteerList } from './pages/volunteers/VolunteerList';
import { InstitutionEdit } from './pages/institution/InstitutionEdit';
import { useAuthStore } from './store/useAuthStore';

function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
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
        element: <Layout />,
        children: [
          { index: true, element: <Navigate to="/artisans" replace /> },
          { path: 'artisans', element: <ArtisanList /> },
          { path: 'artisans/new', element: <ArtisanCreate /> },
          { path: 'products', element: <ProductList /> },
          { path: 'products/new', element: <ProductCreate /> },
          { path: 'events', element: <EventList /> },
          { path: 'events/new', element: <EventCreate /> },
          { path: 'volunteers', element: <VolunteerList /> },
          { path: 'institution', element: <InstitutionEdit /> },
        ],
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
