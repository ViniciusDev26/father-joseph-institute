import { describe, expect, test, vi } from 'vitest';

process.env.API_URL ??= 'https://api.example.com';

vi.mock('next/headers', () => {
  const cookieStore = new Map<string, string>();
  cookieStore.set('cart_session_id', 'test-session');
  return {
    cookies: async () => ({
      get: (k: string) =>
        cookieStore.has(k) ? { name: k, value: cookieStore.get(k) } : undefined,
      set: (k: string, v: string) => cookieStore.set(k, v),
      delete: (k: string) => cookieStore.delete(k),
    }),
  };
});

const { addToCart } = await import('./actions');

describe('addToCart server action regression', () => {
  test('returns the updated cart so the client can refresh quantities without reload', async () => {
    const updatedCart = {
      cartId: 1,
      sessionId: 'test-session',
      items: [
        {
          id: 1,
          quantity: 2,
          product: { id: 10, name: 'Item', price: 5, photoUrl: null },
        },
      ],
    };

    const calls: Array<{ url: string; method: string }> = [];
    const fetchMock = vi.fn(async (url: string | URL, init?: RequestInit) => {
      calls.push({ url: String(url), method: init?.method ?? 'GET' });
      if (calls.length === 1) {
        return new Response(null, { status: 200 });
      }
      return new Response(JSON.stringify(updatedCart), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await addToCart(10, 1);

    expect(result).toEqual(updatedCart);
    expect(calls).toHaveLength(2);
    expect(calls[0]).toEqual({
      url: 'https://api.example.com/cart/items',
      method: 'POST',
    });
    expect(calls[1]).toEqual({
      url: 'https://api.example.com/cart/test-session',
      method: 'GET',
    });
  });

  test('returns null if fetching the updated cart fails so the UI stays consistent', async () => {
    const fetchMock = vi.fn(async (_url: string | URL, init?: RequestInit) => {
      if (init?.method === 'POST') return new Response(null, { status: 200 });
      return new Response(null, { status: 500 });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await addToCart(10, 1);
    expect(result).toBeNull();
  });
});
