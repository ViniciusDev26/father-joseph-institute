import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../lib/storage', () => ({
  generatePresignedPutUrl: async (key: string) => `https://presigned.example.com/${key}`,
  getPublicUrl: (key: string) => `https://public.example.com/${key}`,
}));

let app: FastifyInstance;
let db: typeof import('../database/connection').db;

beforeAll(async () => {
  const { startTestDatabase } = await import('../test/database');
  ({ db } = await startTestDatabase());

  const { buildTestApp } = await import('../test/app');
  const { cartRoutes } = await import('./cart');
  app = await buildTestApp(cartRoutes);
});

afterAll(async () => {
  await app?.close();
  const { stopTestDatabase } = await import('../test/database');
  await stopTestDatabase();
});

beforeEach(async () => {
  const { cartItems, carts, orderItems, orders, products } = await import('../database/schema');
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(cartItems);
  await db.delete(carts);
  await db.delete(products);
});

async function seedProduct(name: string, price: string) {
  const { products } = await import('../database/schema');
  const [row] = await db.insert(products).values({ name, price }).returning();
  return row;
}

async function addItem(sessionId: string, productId: number, quantity: number) {
  const res = await app.inject({
    method: 'POST',
    url: '/cart/items',
    payload: { sessionId, productId, quantity },
  });
  expect(res.statusCode).toBe(200);
  return res.json() as { cartId: number; items: Array<{ id: number; productId: number }> };
}

describe('PATCH /cart/items/:itemId', () => {
  test('increments the quantity to the given value', async () => {
    const product = await seedProduct('Bolsa', '50.00');
    const sessionId = randomUUID();
    const { items } = await addItem(sessionId, product.id, 1);
    const itemId = items[0].id;

    const res = await app.inject({
      method: 'PATCH',
      url: `/cart/items/${itemId}`,
      payload: { sessionId, quantity: 3 },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json() as {
      items: Array<{ id: number; quantity: number; product: { id: number; price: number } }>;
    };
    expect(body.items).toHaveLength(1);
    expect(body.items[0].id).toBe(itemId);
    expect(body.items[0].quantity).toBe(3);
    expect(body.items[0].product.id).toBe(product.id);
    expect(body.items[0].product.price).toBe(50);
  });

  test('decrements the quantity to a smaller positive value', async () => {
    const product = await seedProduct('Vela', '15.00');
    const sessionId = randomUUID();
    const { items } = await addItem(sessionId, product.id, 5);
    const itemId = items[0].id;

    const res = await app.inject({
      method: 'PATCH',
      url: `/cart/items/${itemId}`,
      payload: { sessionId, quantity: 2 },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json() as { items: Array<{ id: number; quantity: number }> };
    expect(body.items).toHaveLength(1);
    expect(body.items[0].quantity).toBe(2);
  });

  test('removes the item when quantity is 0 and persists the deletion', async () => {
    const product = await seedProduct('Sabonete', '8.00');
    const sessionId = randomUUID();
    const { cartId, items } = await addItem(sessionId, product.id, 4);
    const itemId = items[0].id;

    const res = await app.inject({
      method: 'PATCH',
      url: `/cart/items/${itemId}`,
      payload: { sessionId, quantity: 0 },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json() as { cartId: number; items: unknown[] };
    expect(body.cartId).toBe(cartId);
    expect(body.items).toEqual([]);

    const { cartItems } = await import('../database/schema');
    const remaining = await db.select().from(cartItems).where(eq(cartItems.id, itemId));
    expect(remaining).toHaveLength(0);
  });

  test('keeps other items in the cart when one is removed', async () => {
    const a = await seedProduct('A', '10.00');
    const b = await seedProduct('B', '20.00');
    const sessionId = randomUUID();
    await addItem(sessionId, a.id, 1);
    const { items } = await addItem(sessionId, b.id, 2);
    const bItem = items.find(i => i.productId === b.id);
    expect(bItem).toBeDefined();

    const res = await app.inject({
      method: 'PATCH',
      url: `/cart/items/${bItem!.id}`,
      payload: { sessionId, quantity: 0 },
    });
    expect(res.statusCode).toBe(200);

    const body = res.json() as {
      items: Array<{ quantity: number; product: { id: number } }>;
    };
    expect(body.items).toHaveLength(1);
    expect(body.items[0].product.id).toBe(a.id);
    expect(body.items[0].quantity).toBe(1);
  });

  test('returns 400 when quantity is negative', async () => {
    const product = await seedProduct('X', '10.00');
    const sessionId = randomUUID();
    const { items } = await addItem(sessionId, product.id, 1);

    const res = await app.inject({
      method: 'PATCH',
      url: `/cart/items/${items[0].id}`,
      payload: { sessionId, quantity: -1 },
    });
    expect(res.statusCode).toBe(400);
  });

  test('returns 400 when quantity is not an integer', async () => {
    const product = await seedProduct('X', '10.00');
    const sessionId = randomUUID();
    const { items } = await addItem(sessionId, product.id, 1);

    const res = await app.inject({
      method: 'PATCH',
      url: `/cart/items/${items[0].id}`,
      payload: { sessionId, quantity: 1.5 },
    });
    expect(res.statusCode).toBe(400);
  });

  test('returns 404 when no open cart exists for the session', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/cart/items/1',
      payload: { sessionId: randomUUID(), quantity: 1 },
    });
    expect(res.statusCode).toBe(404);
    expect((res.json() as { code: string }).code).toBe('CART_NOT_FOUND');
  });

  test('returns 404 when the item does not belong to the session cart', async () => {
    const product = await seedProduct('Y', '10.00');

    const sessionA = randomUUID();
    const { items } = await addItem(sessionA, product.id, 1);
    const itemId = items[0].id;

    const sessionB = randomUUID();
    await addItem(sessionB, product.id, 1);

    const res = await app.inject({
      method: 'PATCH',
      url: `/cart/items/${itemId}`,
      payload: { sessionId: sessionB, quantity: 5 },
    });
    expect(res.statusCode).toBe(404);
    expect((res.json() as { code: string }).code).toBe('CART_ITEM_NOT_FOUND');
  });

  test('returns 404 when the cart is closed', async () => {
    const { carts } = await import('../database/schema');
    const product = await seedProduct('Z', '10.00');
    const sessionId = randomUUID();
    const { cartId, items } = await addItem(sessionId, product.id, 1);

    await db.update(carts).set({ status: 'closed' }).where(eq(carts.id, cartId));

    const res = await app.inject({
      method: 'PATCH',
      url: `/cart/items/${items[0].id}`,
      payload: { sessionId, quantity: 2 },
    });
    expect(res.statusCode).toBe(404);
    expect((res.json() as { code: string }).code).toBe('CART_NOT_FOUND');
  });
});
