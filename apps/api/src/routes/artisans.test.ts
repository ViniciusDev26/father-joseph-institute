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

describe('POST /artisans regression', () => {
  test('creating a second artisan does not overwrite the first artisan photo', async () => {
    const { artisans } = await import('../database/schema');
    await db.delete(artisans);

    const first = await app.inject({
      method: 'POST',
      url: '/artisans',
      payload: {
        name: 'Maria',
        photo: { mimeType: 'image/jpeg' },
        phone: '11999999999',
      },
    });
    expect(first.statusCode).toBe(201);
    const firstBody = first.json() as { id: number; photoUrl: string };
    expect(firstBody.photoUrl).toBe(`https://public.example.com/artisans/${firstBody.id}.jpg`);

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

    const persistedFirst = items.find(a => a.id === firstBody.id);
    const persistedSecond = items.find(a => a.id === secondBody.id);

    expect(persistedFirst?.photoUrl).toBe(firstBody.photoUrl);
    expect(persistedSecond?.photoUrl).toBe(secondBody.photoUrl);
    expect(persistedFirst?.photoUrl).not.toBe(persistedSecond?.photoUrl);
  });
});
