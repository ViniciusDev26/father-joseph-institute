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
  const { eventRoutes } = await import('./events');
  app = await buildTestApp(eventRoutes);
});

afterAll(async () => {
  await app?.close();
  const { stopTestDatabase } = await import('../test/database');
  await stopTestDatabase();
});

beforeEach(async () => {
  const { eventPhotos, events } = await import('../database/schema');
  await db.delete(eventPhotos);
  await db.delete(events);
});

async function createEvent(overrides: Partial<{ name: string; description: string }> = {}) {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const res = await app.inject({
    method: 'POST',
    url: '/events',
    payload: {
      name: overrides.name ?? 'Festa Junina',
      description: overrides.description ?? 'Evento anual',
      date: tomorrow,
      photos: [{ name: 'a.jpg', mimeType: 'image/jpeg' }],
    },
  });
  expect(res.statusCode).toBe(201);
  return res.json() as {
    id: number;
    name: string;
    description: string | null;
    date: string;
    photos: Array<{ id: number; url: string; presignedUrl: string }>;
  };
}

describe('GET /events/:id', () => {
  test('returns the event with photos', async () => {
    const created = await createEvent();

    const res = await app.inject({ method: 'GET', url: `/events/${created.id}` });
    expect(res.statusCode).toBe(200);
    const body = res.json() as {
      id: number;
      name: string;
      description: string | null;
      date: string;
      photos: Array<{ id: number; url: string }>;
    };
    expect(body.id).toBe(created.id);
    expect(body.name).toBe('Festa Junina');
    expect(body.description).toBe('Evento anual');
    expect(body.photos).toHaveLength(1);
    expect(body.photos[0].url).toBe(created.photos[0].url);
  });

  test('returns 404 for unknown event', async () => {
    const res = await app.inject({ method: 'GET', url: '/events/999999' });
    expect(res.statusCode).toBe(404);
  });

  test('returns 404 for soft-deleted event', async () => {
    const created = await createEvent();

    const { events } = await import('../database/schema');
    const { eq } = await import('drizzle-orm');
    await db.update(events).set({ deletedAt: new Date() }).where(eq(events.id, created.id));

    const res = await app.inject({ method: 'GET', url: `/events/${created.id}` });
    expect(res.statusCode).toBe(404);
  });
});

describe('PATCH /events/:id', () => {
  test('updates name, description and date and returns event with photos', async () => {
    const created = await createEvent();
    const newDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const res = await app.inject({
      method: 'PATCH',
      url: `/events/${created.id}`,
      payload: {
        name: 'Festa Junina (atualizada)',
        description: 'Nova descrição',
        date: newDate,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json() as {
      name: string;
      description: string | null;
      date: string;
      photos: Array<{ id: number }>;
    };
    expect(body.name).toBe('Festa Junina (atualizada)');
    expect(body.description).toBe('Nova descrição');
    expect(new Date(body.date).toISOString()).toBe(newDate);
    expect(body.photos).toHaveLength(1);
  });

  test('updates only the fields provided, leaving others untouched', async () => {
    const created = await createEvent();

    const res = await app.inject({
      method: 'PATCH',
      url: `/events/${created.id}`,
      payload: { name: 'Novo nome apenas' },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json() as { name: string; description: string | null; date: string };
    expect(body.name).toBe('Novo nome apenas');
    expect(body.description).toBe('Evento anual');
    expect(body.date).toBe(created.date);
  });

  test('clears description when null is sent', async () => {
    const created = await createEvent();

    const res = await app.inject({
      method: 'PATCH',
      url: `/events/${created.id}`,
      payload: { description: null },
    });

    expect(res.statusCode).toBe(200);
    expect((res.json() as { description: string | null }).description).toBeNull();
  });

  test('rejects empty body with 400', async () => {
    const created = await createEvent();

    const res = await app.inject({
      method: 'PATCH',
      url: `/events/${created.id}`,
      payload: {},
    });
    expect(res.statusCode).toBe(400);
  });

  test('returns 404 for unknown event', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/events/999999',
      payload: { name: 'whatever' },
    });
    expect(res.statusCode).toBe(404);
  });

  test('does not modify a soft-deleted event and returns 404', async () => {
    const created = await createEvent();

    const { events } = await import('../database/schema');
    const { eq } = await import('drizzle-orm');
    await db.update(events).set({ deletedAt: new Date() }).where(eq(events.id, created.id));

    const res = await app.inject({
      method: 'PATCH',
      url: `/events/${created.id}`,
      payload: { name: 'should not apply' },
    });
    expect(res.statusCode).toBe(404);

    const [row] = await db.select().from(events).where(eq(events.id, created.id));
    expect(row.name).toBe('Festa Junina');
  });
});

describe('POST /events/:id/photos', () => {
  test('adds new photos to an existing event', async () => {
    const created = await createEvent();

    const res = await app.inject({
      method: 'POST',
      url: `/events/${created.id}/photos`,
      payload: {
        photos: [
          { name: 'b.png', mimeType: 'image/png' },
          { name: 'c.jpg', mimeType: 'image/jpeg' },
        ],
      },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json() as {
      photos: Array<{ id: number; url: string; presignedUrl: string }>;
    };
    expect(body.photos).toHaveLength(2);
    for (const photo of body.photos) {
      expect(photo.url).toMatch(new RegExp(`^https://public\\.example\\.com/events/${created.id}/`));
      expect(photo.presignedUrl).toMatch(/^https:\/\/presigned\.example\.com\/events\//);
    }

    const get = await app.inject({ method: 'GET', url: `/events/${created.id}` });
    const persisted = get.json() as { photos: Array<{ id: number; url: string }> };
    expect(persisted.photos).toHaveLength(3);
  });

  test('rejects empty photos array with 400', async () => {
    const created = await createEvent();

    const res = await app.inject({
      method: 'POST',
      url: `/events/${created.id}/photos`,
      payload: { photos: [] },
    });
    expect(res.statusCode).toBe(400);
  });

  test('returns 404 for unknown event and inserts no photos', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/events/999999/photos',
      payload: { photos: [{ name: 'x.jpg', mimeType: 'image/jpeg' }] },
    });
    expect(res.statusCode).toBe(404);

    const { eventPhotos } = await import('../database/schema');
    const rows = await db.select().from(eventPhotos);
    expect(rows).toHaveLength(0);
  });

  test('returns 404 for soft-deleted event and inserts no photos', async () => {
    const created = await createEvent();

    const { events, eventPhotos } = await import('../database/schema');
    const { eq } = await import('drizzle-orm');
    await db.update(events).set({ deletedAt: new Date() }).where(eq(events.id, created.id));

    const before = await db.select().from(eventPhotos);

    const res = await app.inject({
      method: 'POST',
      url: `/events/${created.id}/photos`,
      payload: { photos: [{ name: 'x.jpg', mimeType: 'image/jpeg' }] },
    });
    expect(res.statusCode).toBe(404);

    const after = await db.select().from(eventPhotos);
    expect(after).toHaveLength(before.length);
  });
});
