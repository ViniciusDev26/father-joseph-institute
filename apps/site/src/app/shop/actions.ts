'use server';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';
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
    const res = await fetch(`${env.API_URL}/cart/${sessionId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json() as Promise<Cart>;
  } catch {
    return null;
  }
}

export async function addToCart(productId: number, quantity: number): Promise<void> {
  const sessionId = await getOrCreateSessionId();
  await fetch(`${env.API_URL}/cart/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, productId, quantity }),
    cache: 'no-store',
  });
}

export async function checkout(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;

  try {
    const res = await fetch(`${env.API_URL}/cart/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { whatsappUrl: string };
    cookieStore.delete(COOKIE_NAME);
    return data.whatsappUrl;
  } catch {
    return null;
  }
}
