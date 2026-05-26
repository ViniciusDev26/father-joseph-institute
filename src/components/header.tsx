'use client';

import Link from 'next/link';
import { useState } from 'react';
import { navLinks, routes } from '@/lib/routes';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bark/5 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href={routes.home}
          className="font-display text-xl font-semibold tracking-tight text-bark sm:text-2xl"
        >
          Instituto Padre José
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-bark-light transition-colors hover:text-terracotta"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={routes.donations}
            className="text-sm font-medium text-terracotta transition-colors hover:text-terracotta-dark"
          >
            Doe
          </Link>
          <Link
            href={routes.volunteer}
            className="rounded-full bg-terracotta px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark"
          >
            Seja Voluntário
          </Link>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg text-bark transition-colors hover:bg-bark/5 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            {isOpen ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <nav className="border-t border-bark/5 bg-cream px-6 pb-6 pt-4 lg:hidden">
          <ul className="space-y-1">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-sm text-bark-light transition-colors hover:bg-bark/5 hover:text-terracotta"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3 border-t border-bark/5 pt-4">
            <Link
              href={routes.donations}
              className="rounded-full border border-terracotta px-5 py-2.5 text-center text-sm font-medium text-terracotta transition-colors hover:bg-terracotta hover:text-cream"
              onClick={() => setIsOpen(false)}
            >
              Doe
            </Link>
            <Link
              href={routes.volunteer}
              className="rounded-full bg-terracotta px-5 py-2.5 text-center text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark"
              onClick={() => setIsOpen(false)}
            >
              Seja Voluntário
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
