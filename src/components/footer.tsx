import Link from 'next/link';
import content from '@/content.json';
import { routes } from '@/lib/routes';

const quickLinks = [
  { href: routes.about, label: 'Quem Somos' },
  { href: routes.artisans, label: 'Artesãs' },
  { href: routes.events, label: 'Eventos' },
  { href: routes.shop, label: 'Loja Virtual' },
  { href: routes.contact, label: 'Contato' },
];

const actionLinks = [
  { href: routes.donations, label: 'Caixinha Solidária' },
  { href: routes.volunteer, label: 'Seja Voluntário' },
  { href: routes.products, label: 'Produtos' },
];

export function Footer() {
  return (
    <footer className="bg-bark text-cream/70">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <h3 className="font-display text-xl font-semibold text-cream">Instituto Padre José</h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{content.footer.description}</p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cream/50">
              Navegação
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cream/50">
              Participe
            </h4>
            <ul className="space-y-2.5">
              {actionLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-cream/50">
                Contato
              </h4>
              <Link href={routes.contact} className="text-sm transition-colors hover:text-cream">
                Ver informações de contato →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/10 pt-8 text-center text-xs text-cream/40">
          &copy; {new Date().getFullYear()} Instituto Padre José. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
