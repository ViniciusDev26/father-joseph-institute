export interface HeroSection {
  tag: string;
  title: string;
  subtitle: string;
}

export interface AboutContent {
  hero: HeroSection;
  mission: { quote: string };
  story: { tag: string; title: string; paragraphs: string[]; image?: string };
  values: { tag: string; title: string; items: { title: string; description: string }[] };
  impact: { tag: string; title: string; stats: { value: string; label: string }[] };
  cta: { tag: string; title: string; description: string };
}

export interface SiteContent {
  home: { subtitle: string; cta: string };
  about: AboutContent;
  artisans: { hero: HeroSection; empty: string; error: string };
  events: { hero: HeroSection; empty: string; error: string };
  products: { hero: HeroSection; empty: string; error: string; by: string };
  shop: {
    hero: HeroSection;
    addToCart: string;
    cart: { title: string; empty: string; checkout: string; total: string; remove: string };
    empty: string;
    error: string;
  };
  volunteer: {
    hero: HeroSection;
    form: {
      name: string;
      namePlaceholder: string;
      profession: string;
      professionPlaceholder: string;
      availability: string;
      days: string;
      startTime: string;
      endTime: string;
      submit: string;
      submitting: string;
    };
    days: Record<string, string>;
    success: { title: string; description: string; button: string };
    error: string;
  };
  contact: {
    hero: HeroSection;
    whatsapp: string;
    instagram: string;
    address: { title: string; value: string };
    notFound: string;
  };
  donations: {
    hero: HeroSection;
    pix: { title: string; copy: string; copied: string; instruction: string };
    notFound: string;
    impact: { title: string; items: string[] };
  };
  footer: { description: string };
}

export interface Artisan {
  id: number;
  name: string;
  photoUrl: string;
  phone: string | null;
  email: string | null;
  description: string | null;
}

export interface EventPhoto {
  id: number;
  url: string;
}

export interface ApiEvent {
  id: number;
  name: string;
  description: string | null;
  date: string;
  photos: EventPhoto[];
}

export interface ProductArtisan {
  id: number;
  name: string;
}

export interface ProductPhoto {
  id: number;
  url: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  photos: ProductPhoto[];
  artisans: ProductArtisan[];
}

export interface Institution {
  id: number;
  name: string;
  slug: string;
  instagram: string | null;
  whatsapp: string | null;
  pixKey: string | null;
  addressStreet: string | null;
  addressComplement: string | null;
  addressNeighborhood: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressZip: string | null;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    photoUrl: string | null;
  };
}

export interface Cart {
  cartId: number;
  sessionId: string;
  items: CartItem[];
}
