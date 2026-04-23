import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const navItems = [
  { to: '/artisans', label: 'Artesãs' },
  { to: '/products', label: 'Produtos' },
  { to: '/events', label: 'Eventos' },
  { to: '/volunteers', label: 'Voluntários' },
  { to: '/institution', label: 'Instituição' },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const clearToken = useAuthStore((state) => state.clearToken);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
    onNavigate?.();
  };

  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
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
    </>
  );
}

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 inset-x-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 leading-none">Admin</p>
          <p className="text-sm font-semibold text-gray-800 leading-tight">Instituto Padre José</p>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Abrir menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Mobile nav overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative z-50 w-64 bg-white flex flex-col h-full shadow-xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Admin</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-800">Instituto Padre José</p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
                aria-label="Fechar menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <NavItems onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="md:flex md:h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-60 flex-shrink-0 bg-white border-r border-gray-200 flex-col">
          <div className="px-6 py-5 border-b border-gray-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Admin</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-800">Instituto Padre José</p>
          </div>
          <NavItems />
        </aside>

        <main className="flex-1 overflow-auto pt-14 md:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
