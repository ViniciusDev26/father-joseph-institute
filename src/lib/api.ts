import type { ApiEvent, Artisan, Institution, Product } from '@/types/content';
import { getArtisans } from './data/artisans';
import { getEvents } from './data/events';
import { getInstitution } from './data/institution';
import { getProducts } from './data/products';

export async function fetchArtisans(): Promise<Artisan[]> {
  try {
    return await getArtisans();
  } catch {
    return [];
  }
}

export async function fetchEvents(): Promise<ApiEvent[]> {
  try {
    return await getEvents();
  } catch {
    return [];
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    return await getProducts();
  } catch {
    return [];
  }
}

export async function fetchInstitution(): Promise<Institution | null> {
  try {
    return await getInstitution();
  } catch {
    return null;
  }
}
