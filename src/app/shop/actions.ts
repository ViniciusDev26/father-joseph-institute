'use server';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import type { Cart } from '@/types/content';

// TODO(phase-2): port cart logic to data layer once cart route handlers exist.
// Currently stubbed because the external API was removed in the fullstack migration.

const COOKIE_NAME = 'cart_session_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;
  if (existing) return existing;
  const id = randomUUID();
  cookieStore.set(COOKIE_NAME, id, { maxAge: COOKIE_MAX_AGE, path: '/' });
  return id;
}

export async function getCart(): Promise<Cart | null> {
  return null;
}

export async function addToCart(_productId: number, _quantity: number): Promise<Cart | null> {
  await getOrCreateSessionId();
  return null;
}

export async function updateCartItemQuantity(
  _itemId: number,
  _quantity: number,
): Promise<Cart | null> {
  return null;
}

export async function checkout(): Promise<string | null> {
  return null;
}
