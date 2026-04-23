import axios from 'axios';
import { env } from '@/lib/env';
import type { ApiEvent, Artisan, Institution, Product } from '@/types/content';

const api = axios.create({
  baseURL: env.API_URL,
});

export async function fetchArtisans(): Promise<Artisan[]> {
  try {
    const { data } = await api.get<{ artisans: Artisan[] }>('/artisans', {
      headers: { 'Cache-Control': 'no-store' },
    });
    return data.artisans;
  } catch {
    return [];
  }
}

export async function fetchEvents(): Promise<ApiEvent[]> {
  try {
    const { data } = await api.get<{ events: ApiEvent[] }>('/events', {
      headers: { 'Cache-Control': 'no-store' },
    });
    return data.events;
  } catch {
    return [];
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get<{ products: Product[] }>('/products', {
      headers: { 'Cache-Control': 'no-store' },
    });
    return data.products;
  } catch {
    return [];
  }
}

export async function fetchInstitution(): Promise<Institution | null> {
  try {
    const { data } = await api.get<Institution>('/institution', {
      headers: { 'Cache-Control': 'no-store' },
    });
    return data;
  } catch {
    return null;
  }
}
