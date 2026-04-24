import { env } from '@/lib/env';
import type { ApiEvent, Artisan, Institution, Product } from '@/types/content';

const BASE_URL = env.API_URL;

export async function fetchArtisans(): Promise<Artisan[]> {
  try {
    const res = await fetch(`${BASE_URL}/artisans`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.artisans;
  } catch {
    return [];
  }
}

export async function fetchEvents(): Promise<ApiEvent[]> {
  try {
    const res = await fetch(`${BASE_URL}/events`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.events;
  } catch {
    return [];
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${BASE_URL}/products`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products;
  } catch {
    return [];
  }
}

export async function fetchInstitution(): Promise<Institution | null> {
  try {
    const res = await fetch(`${BASE_URL}/institution`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
