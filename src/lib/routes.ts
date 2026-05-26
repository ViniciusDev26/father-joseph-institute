export const routes = {
  home: '/',
  about: '/about',
  artisans: '/artisans',
  events: '/events',
  products: '/products',
  shop: '/shop',
  contact: '/contact',
  donations: '/donations',
  volunteer: '/volunteer',
} as const;

export const navLinks = [
  { href: routes.about, label: 'Quem Somos' },
  { href: routes.artisans, label: 'Artesãs' },
  { href: routes.events, label: 'Eventos' },
  { href: routes.products, label: 'Produtos' },
  { href: routes.shop, label: 'Loja' },
  { href: routes.contact, label: 'Contato' },
] as const;
