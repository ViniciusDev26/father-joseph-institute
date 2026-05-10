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
  app = await buildTestApp(artisanRoutes);
});

afterAll(async () => {
  await app?.close();
  const { stopTestDatabase } = await import('../test/database');
  await stopTestDatabase();
});

async function clearArtisans() {
  const { artisans } = await import('../database/schema');
  await db.delete(artisans);
}

async function createArtisan(payload?: Partial<{ name: string; phone: string; email: string }>) {
  const res = await app.inject({
    method: 'POST',
    url: '/artisans',
    payload: {
      name: payload?.name ?? 'Maria',
      photo: { mimeType: 'image/jpeg' },
      phone: payload?.phone ?? '11999999999',
      ...(payload?.email ? { email: payload.email } : {}),
    },
  });
  expect(res.statusCode).toBe(201);
  return res.json() as {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    description: string | null;
    photoUrl: string;
  };
}

describe('POST /artisans regression', () => {
  test('creating a second artisan does not overwrite the first artisan photo', async () => {
    await clearArtisans();

    const first = await createArtisan({ name: 'Maria', phone: '11999999999' });
    expect(first.photoUrl).toBe(`https://public.example.com/artisans/${first.id}.jpg`);

    const second = await app.inject({
      method: 'POST',
      url: '/artisans',
      payload: {
        name: 'Joana',
        photo: { mimeType: 'image/png' },
        phone: '11888888888',
      },
    });
    expect(second.statusCode).toBe(201);
    const secondBody = second.json() as { id: number; photoUrl: string };
    expect(secondBody.photoUrl).toBe(`https://public.example.com/artisans/${secondBody.id}.png`);

    const list = await app.inject({ method: 'GET', url: '/artisans' });
    const items = (list.json() as { artisans: Array<{ id: number; photoUrl: string }> }).artisans;

    const persistedFirst = items.find(a => a.id === first.id);
    const persistedSecond = items.find(a => a.id === secondBody.id);

    expect(persistedFirst?.photoUrl).toBe(first.photoUrl);
    expect(persistedSecond?.photoUrl).toBe(secondBody.photoUrl);
    expect(persistedFirst?.photoUrl).not.toBe(persistedSecond?.photoUrl);
  });
});

describe('GET /artisans/:id', () => {
  test('returns 200 with the artisan', async () => {
    await clearArtisans();
    const created = await createArtisan({ name: 'Maria', email: 'maria@example.com' });

    const res = await app.inject({ method: 'GET', url: `/artisans/${created.id}` });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({
      id: created.id,
      name: 'Maria',
      email: 'maria@example.com',
    });
  });

  test('returns 404 for non-existent id', async () => {
    const res = await app.inject({ method: 'GET', url: '/artisans/999999' });
    expect(res.statusCode).toBe(404);
  });

  test('returns 404 for soft-deleted artisan', async () => {
    await clearArtisans();
    const created = await createArtisan();
    await app.inject({ method: 'DELETE', url: `/artisans/${created.id}` });

    const res = await app.inject({ method: 'GET', url: `/artisans/${created.id}` });
    expect(res.statusCode).toBe(404);
  });
});

describe('PATCH /artisans/:id', () => {
  test('updates the provided fields and refreshes updated_at', async () => {
    await clearArtisans();
    const created = await createArtisan({ name: 'Maria', phone: '11999999999' });

    const res = await app.inject({
      method: 'PATCH',
      url: `/artisans/${created.id}`,
      payload: { name: 'Maria Atualizada', description: 'Bordadeira' },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({
      id: created.id,
      name: 'Maria Atualizada',
      description: 'Bordadeira',
      phone: '11999999999',
    });
  });

  test('clears phone with null when email remains', async () => {
    await clearArtisans();
    const created = await createArtisan({ phone: '11999999999', email: 'a@b.com' });

    const res = await app.inject({
      method: 'PATCH',
      url: `/artisans/${created.id}`,
      payload: { phone: null },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ phone: null, email: 'a@b.com' });
  });

  test('returns 400 when clearing both phone and email', async () => {
    await clearArtisans();
    const created = await createArtisan({ phone: '11999999999', email: 'a@b.com' });

    const res = await app.inject({
      method: 'PATCH',
      url: `/artisans/${created.id}`,
      payload: { phone: null, email: null },
    });

    expect(res.statusCode).toBe(400);
  });

  test('returns 400 with empty body', async () => {
    await clearArtisans();
    const created = await createArtisan();

    const res = await app.inject({
      method: 'PATCH',
      url: `/artisans/${created.id}`,
      payload: {},
    });

    expect(res.statusCode).toBe(400);
  });

  test('returns 404 for non-existent artisan', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/artisans/999999',
      payload: { name: 'Nope' },
    });
    expect(res.statusCode).toBe(404);
  });

  test('returns 404 for soft-deleted artisan', async () => {
    await clearArtisans();
    const created = await createArtisan();
    await app.inject({ method: 'DELETE', url: `/artisans/${created.id}` });

    const res = await app.inject({
      method: 'PATCH',
      url: `/artisans/${created.id}`,
      payload: { name: 'X' },
    });
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /artisans/:id', () => {
  test('soft-deletes and removes from list', async () => {
    await clearArtisans();
    const created = await createArtisan();

    const del = await app.inject({ method: 'DELETE', url: `/artisans/${created.id}` });
    expect(del.statusCode).toBe(204);

    const list = await app.inject({ method: 'GET', url: '/artisans' });
    const items = (list.json() as { artisans: Array<{ id: number }> }).artisans;
    expect(items.find(a => a.id === created.id)).toBeUndefined();
  });

  test('returns 404 when deleting twice', async () => {
    await clearArtisans();
    const created = await createArtisan();

    const first = await app.inject({ method: 'DELETE', url: `/artisans/${created.id}` });
    expect(first.statusCode).toBe(204);

    const second = await app.inject({ method: 'DELETE', url: `/artisans/${created.id}` });
    expect(second.statusCode).toBe(404);
  });

  test('returns 404 for non-existent id', async () => {
    const res = await app.inject({ method: 'DELETE', url: '/artisans/999999' });
    expect(res.statusCode).toBe(404);
  });
});
