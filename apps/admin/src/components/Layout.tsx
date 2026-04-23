import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const navItems = [
  { to: '/artisans', label: 'Artesãs' },
  { to: '/products', label: 'Produtos' },
  { to: '/events', label: 'Eventos' },
  { to: '/volunteers', label: 'Voluntários' },
  { to: '/institution', label: 'Instituição' },
];

export function Layout() {
  const clearToken = useAuthStore((state) => state.clearToken);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Admin</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-800">Instituto Padre José</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
