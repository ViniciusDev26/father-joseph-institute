import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

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
  const { artisanRoutes } = await import('./artisans');
  const { productRoutes } = await import('./products');
  app = await buildTestApp([artisanRoutes, productRoutes]);
});

afterAll(async () => {
  await app?.close();
  const { stopTestDatabase } = await import('../test/database');
  await stopTestDatabase();
});

async function clearAll() {
  const { artisans, productArtisans, productPhotos, products } = await import(
    '../database/schema'
  );
  await db.delete(productArtisans);
  await db.delete(productPhotos);
  await db.delete(products);
  await db.delete(artisans);
}

async function createArtisan(name: string) {
  const res = await app.inject({
    method: 'POST',
    url: '/artisans',
    payload: { name, photo: { mimeType: 'image/jpeg' }, phone: '11999999999' },
  });
  expect(res.statusCode).toBe(201);
  return (res.json() as { id: number }).id;
}

async function createProduct(opts: {
  name?: string;
  price?: number;
  artisanIds: number[];
  description?: string;
}) {
  const res = await app.inject({
    method: 'POST',
    url: '/products',
    payload: {
      name: opts.name ?? 'Bolsa',
      price: opts.price ?? 50,
      artisanIds: opts.artisanIds,
      photos: [{ mimeType: 'image/jpeg' }],
      ...(opts.description ? { description: opts.description } : {}),
    },
  });
  expect(res.statusCode).toBe(201);
  return res.json() as {
    id: number;
    name: string;
    description: string | null;
    price: number;
    photos: { id: number; url: string }[];
    artisans: { id: number; name: string }[];
  };
}

describe('GET /products/:id', () => {
  test('returns 200 with photos and artisans', async () => {
    await clearAll();
    const a1 = await createArtisan('Maria');
    const a2 = await createArtisan('Joana');
    const product = await createProduct({ name: 'Bolsa', artisanIds: [a1, a2] });

    const res = await app.inject({ method: 'GET', url: `/products/${product.id}` });
    expect(res.statusCode).toBe(200);
    const body = res.json() as {
      id: number;
      name: string;
      photos: unknown[];
      artisans: { id: number }[];
    };
    expect(body.id).toBe(product.id);
    expect(body.photos).toHaveLength(1);
    expect(body.artisans.map(a => a.id).sort()).toEqual([a1, a2].sort());
  });

  test('returns 404 for non-existent product', async () => {
    const res = await app.inject({ method: 'GET', url: '/products/999999' });
    expect(res.statusCode).toBe(404);
  });

  test('returns 404 for soft-deleted product', async () => {
    await clearAll();
    const a1 = await createArtisan('Maria');
    const product = await createProduct({ artisanIds: [a1] });
    await app.inject({ method: 'DELETE', url: `/products/${product.id}` });

    const res = await app.inject({ method: 'GET', url: `/products/${product.id}` });
    expect(res.statusCode).toBe(404);
  });
});

describe('PATCH /products/:id', () => {
  test('updates name, description and price', async () => {
    await clearAll();
    const a1 = await createArtisan('Maria');
    const product = await createProduct({ name: 'Bolsa', price: 50, artisanIds: [a1] });

    const res = await app.inject({
      method: 'PATCH',
      url: `/products/${product.id}`,
      payload: { name: 'Bolsa Nova', description: 'Bordada à mão', price: 75.5 },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({
      name: 'Bolsa Nova',
      description: 'Bordada à mão',
      price: 75.5,
    });
  });

  test('replaces artisan associations', async () => {
    await clearAll();
    const a1 = await createArtisan('Maria');
    const a2 = await createArtisan('Joana');
    const a3 = await createArtisan('Ana');
    const product = await createProduct({ artisanIds: [a1, a2] });

    const res = await app.inject({
      method: 'PATCH',
      url: `/products/${product.id}`,
      payload: { artisanIds: [a3] },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { artisans: { id: number }[] };
    expect(body.artisans.map(a => a.id)).toEqual([a3]);
  });

  test('returns 422 when artisanIds contain non-existent ID', async () => {
    await clearAll();
    const a1 = await createArtisan('Maria');
    const product = await createProduct({ artisanIds: [a1] });

    const res = await app.inject({
      method: 'PATCH',
      url: `/products/${product.id}`,
      payload: { artisanIds: [a1, 999999] },
    });
    expect(res.statusCode).toBe(422);
  });

  test('clears description with null', async () => {
    await clearAll();
    const a1 = await createArtisan('Maria');
    const product = await createProduct({ artisanIds: [a1], description: 'old' });

    const res = await app.inject({
      method: 'PATCH',
      url: `/products/${product.id}`,
      payload: { description: null },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ description: null });
  });

  test('returns 400 with empty body', async () => {
    await clearAll();
    const a1 = await createArtisan('Maria');
    const product = await createProduct({ artisanIds: [a1] });

    const res = await app.inject({
      method: 'PATCH',
      url: `/products/${product.id}`,
      payload: {},
    });
    expect(res.statusCode).toBe(400);
  });

  test('returns 400 when price is not positive', async () => {
    await clearAll();
    const a1 = await createArtisan('Maria');
    const product = await createProduct({ artisanIds: [a1] });

    const res = await app.inject({
      method: 'PATCH',
      url: `/products/${product.id}`,
      payload: { price: 0 },
    });
    expect(res.statusCode).toBe(400);
  });

  test('returns 404 for non-existent product', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/products/999999',
      payload: { name: 'Nope' },
    });
    expect(res.statusCode).toBe(404);
  });

  test('returns 404 for soft-deleted product', async () => {
    await clearAll();
    const a1 = await createArtisan('Maria');
    const product = await createProduct({ artisanIds: [a1] });
    await app.inject({ method: 'DELETE', url: `/products/${product.id}` });

    const res = await app.inject({
      method: 'PATCH',
      url: `/products/${product.id}`,
      payload: { name: 'X' },
    });
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /products/:id', () => {
  test('soft-deletes and removes from list', async () => {
    await clearAll();
    const a1 = await createArtisan('Maria');
    const product = await createProduct({ artisanIds: [a1] });

    const del = await app.inject({ method: 'DELETE', url: `/products/${product.id}` });
    expect(del.statusCode).toBe(204);

    const list = await app.inject({ method: 'GET', url: '/products' });
    const items = (list.json() as { products: { id: number }[] }).products;
    expect(items.find(p => p.id === product.id)).toBeUndefined();
  });

  test('returns 404 when deleting twice', async () => {
    await clearAll();
    const a1 = await createArtisan('Maria');
    const product = await createProduct({ artisanIds: [a1] });

    const first = await app.inject({ method: 'DELETE', url: `/products/${product.id}` });
    expect(first.statusCode).toBe(204);

    const second = await app.inject({ method: 'DELETE', url: `/products/${product.id}` });
    expect(second.statusCode).toBe(404);
  });

  test('returns 404 for non-existent id', async () => {
    const res = await app.inject({ method: 'DELETE', url: '/products/999999' });
    expect(res.statusCode).toBe(404);
  });
});

describe('GET /products visibility', () => {
  test('hides artisans that have been soft-deleted from the product', async () => {
    await clearAll();
    const a1 = await createArtisan('Maria');
    const a2 = await createArtisan('Joana');
    const product = await createProduct({ artisanIds: [a1, a2] });

    await app.inject({ method: 'DELETE', url: `/artisans/${a2}` });

    const list = await app.inject({ method: 'GET', url: '/products' });
    const items = (list.json() as { products: { id: number; artisans: { id: number }[] }[] })
      .products;
    const found = items.find(p => p.id === product.id);
    expect(found?.artisans.map(a => a.id)).toEqual([a1]);
  });
});
