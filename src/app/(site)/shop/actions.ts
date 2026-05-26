'use server';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import {
  addToCart as addToCartData,
  checkout as checkoutData,
  getCartBySession,
  updateCartItemQuantity as updateCartItemQuantityData,
} from '@/lib/data/cart';
import type { Cart } from '@/types/content';

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
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;
  try {
    return await getCartBySession(sessionId);
  } catch {
    return null;
  }
}

export async function addToCart(productId: number, quantity: number): Promise<Cart | null> {
  const sessionId = await getOrCreateSessionId();
  try {
    const result = await addToCartData({ sessionId, productId, quantity });
    if (!result.ok) return null;
    return result.cart;
  } catch {
    return null;
  }
}

export async function updateCartItemQuantity(
  itemId: number,
  quantity: number,
): Promise<Cart | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;
  try {
    const result = await updateCartItemQuantityData(itemId, sessionId, quantity);
    if (!result.ok) return null;
    return result.cart;
  } catch {
    return null;
  }
}

export async function checkout(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;
  try {
    const result = await checkoutData(sessionId);
    if (!result.ok) return null;
    cookieStore.delete(COOKIE_NAME);
    return result.whatsappUrl;
  } catch {
    return null;
  }
}
