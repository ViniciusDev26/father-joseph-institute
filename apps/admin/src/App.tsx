import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ArtisanCreate } from './pages/artisans/ArtisanCreate';
import { ArtisanList } from './pages/artisans/ArtisanList';
import { EventCreate } from './pages/events/EventCreate';
import { EventList } from './pages/events/EventList';
import { InstitutionEdit } from './pages/institution/InstitutionEdit';
import { Login } from './pages/Login';
import { OrderList } from './pages/orders/OrderList';
import { ProductCreate } from './pages/products/ProductCreate';
import { ProductList } from './pages/products/ProductList';
import { VolunteerList } from './pages/volunteers/VolunteerList';
import { useAuthStore } from './store/useAuthStore';

function ProtectedRoute() {
  const token = useAuthStore(state => state.token);
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
          { path: 'orders', element: <OrderList /> },
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
