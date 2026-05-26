import { and, desc, eq, isNull } from 'drizzle-orm';
import { db } from '@/db/connection';
import { eventPhotos, events } from '@/db/schema';
import { getPublicUrl } from '@/lib/storage';
import type { ApiEvent } from '@/types/content';

type EventRow = {
  id: number;
  name: string;
  description: string | null;
  date: Date;
  photoId: number | null;
  objectKey: string | null;
};

function rollupEvents(rows: EventRow[]): ApiEvent[] {
  const map = new Map<number, ApiEvent>();

  for (const row of rows) {
    let event = map.get(row.id);
    if (!event) {
      event = {
        id: row.id,
        name: row.name,
        description: row.description,
        date: row.date.toISOString(),
        photos: [],
      };
      map.set(row.id, event);
    }
    if (row.photoId && row.objectKey) {
      event.photos.push({ id: row.photoId, url: getPublicUrl(row.objectKey) });
    }
  }

  return [...map.values()];
}

export async function getEvents(): Promise<ApiEvent[]> {
  const rows = await db
    .select({
      id: events.id,
      name: events.name,
      description: events.description,
      date: events.date,
      photoId: eventPhotos.id,
      objectKey: eventPhotos.objectKey,
    })
    .from(events)
    .leftJoin(eventPhotos, eq(eventPhotos.eventId, events.id))
    .where(isNull(events.deletedAt))
    .orderBy(desc(events.date));

  return rollupEvents(rows);
}

export async function getEventById(id: number): Promise<ApiEvent | null> {
  const rows = await db
    .select({
      id: events.id,
      name: events.name,
      description: events.description,
      date: events.date,
      photoId: eventPhotos.id,
      objectKey: eventPhotos.objectKey,
    })
    .from(events)
    .leftJoin(eventPhotos, eq(eventPhotos.eventId, events.id))
    .where(and(eq(events.id, id), isNull(events.deletedAt)));

  if (rows.length === 0) return null;
  return rollupEvents(rows)[0] ?? null;
}
