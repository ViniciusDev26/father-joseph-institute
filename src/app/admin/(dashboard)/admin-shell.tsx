'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useState } from 'react';

const navItems = [
  { to: '/admin/artisans', label: 'Artesãs' },
  { to: '/admin/assisted-people', label: 'Moradores de rua' },
  { to: '/admin/products', label: 'Produtos' },
  { to: '/admin/events', label: 'Eventos' },
  { to: '/admin/orders', label: 'Pedidos' },
  { to: '/admin/volunteers', label: 'Voluntários' },
  { to: '/admin/institution', label: 'Instituição' },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    onNavigate?.();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(item => {
          const isActive = pathname === item.to || pathname.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              href={item.to}
              onClick={onNavigate}
              className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          Sair
        </button>
      </div>
    </>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="md:hidden fixed top-0 inset-x-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 leading-none">
            Admin
          </p>
          <p className="text-sm font-semibold text-gray-800 leading-tight">Instituto Padre José</p>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Abrir menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative z-50 w-64 bg-white flex flex-col h-full shadow-xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Admin
                </p>
                <p className="mt-0.5 text-sm font-semibold text-gray-800">Instituto Padre José</p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
                aria-label="Fechar menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <NavItems onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="md:flex md:h-screen">
        <aside className="hidden md:flex w-60 flex-shrink-0 bg-white border-r border-gray-200 flex-col">
          <div className="px-6 py-5 border-b border-gray-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Admin</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-800">Instituto Padre José</p>
          </div>
          <NavItems />
        </aside>

        <main className="flex-1 overflow-auto pt-14 md:pt-0">{children}</main>
      </div>
    </div>
  );
}
