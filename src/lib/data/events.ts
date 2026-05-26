import { randomUUID } from 'node:crypto';
import { and, count, desc, eq, isNull } from 'drizzle-orm';
import { db } from '@/db/connection';
import { eventPhotos, events } from '@/db/schema';
import { deleteObject, generatePresignedPutUrl, getPublicUrl } from '@/lib/storage';
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

async function loadEventRows(eventId?: number) {
  const base = db
    .select({
      id: events.id,
      name: events.name,
      description: events.description,
      date: events.date,
      photoId: eventPhotos.id,
      objectKey: eventPhotos.objectKey,
    })
    .from(events)
    .leftJoin(eventPhotos, eq(eventPhotos.eventId, events.id));

  if (eventId !== undefined) {
    return base.where(and(eq(events.id, eventId), isNull(events.deletedAt)));
  }
  return base.where(isNull(events.deletedAt)).orderBy(desc(events.date));
}

export async function getEvents(): Promise<ApiEvent[]> {
  return rollupEvents(await loadEventRows());
}

export async function getEventById(id: number): Promise<ApiEvent | null> {
  const rows = await loadEventRows(id);
  if (rows.length === 0) return null;
  return rollupEvents(rows)[0] ?? null;
}

export type EventPhotoInput = { mimeType: 'image/png' | 'image/jpeg' };
export type CreatedPhoto = { id: number; url: string; presignedUrl: string };

async function insertPhotos(eventId: number, photos: EventPhotoInput[]): Promise<CreatedPhoto[]> {
  return Promise.all(
    photos.map(async photo => {
      const ext = photo.mimeType === 'image/png' ? 'png' : 'jpg';
      const objectKey = `events/${eventId}/${randomUUID()}.${ext}`;
      const [inserted] = await db
        .insert(eventPhotos)
        .values({ eventId, objectKey, mimeType: photo.mimeType })
        .returning();
      const presignedUrl = await generatePresignedPutUrl(objectKey, photo.mimeType);
      return { id: inserted.id, url: getPublicUrl(objectKey), presignedUrl };
    }),
  );
}

export type CreateEventInput = {
  name: string;
  description?: string | null;
  date: string;
  photos: EventPhotoInput[];
};

export type CreatedEvent = {
  id: number;
  name: string;
  description: string | null;
  date: string;
  photos: CreatedPhoto[];
};

export async function createEvent(input: CreateEventInput): Promise<CreatedEvent> {
  const [event] = await db
    .insert(events)
    .values({
      name: input.name,
      description: input.description ?? null,
      date: new Date(input.date),
    })
    .returning();

  const photos = await insertPhotos(event.id, input.photos);

  return {
    id: event.id,
    name: event.name,
    description: event.description,
    date: event.date.toISOString(),
    photos,
  };
}

export type UpdateEventInput = {
  name?: string;
  description?: string | null;
  date?: string;
};

export type UpdateEventResult =
  | { ok: true; event: ApiEvent }
  | { ok: false; code: 'EVENT_NOT_FOUND'; message: string };

export async function updateEvent(id: number, patch: UpdateEventInput): Promise<UpdateEventResult> {
  const updates: { name?: string; description?: string | null; date?: Date; updatedAt: Date } = {
    updatedAt: new Date(),
  };
  if (patch.name !== undefined) updates.name = patch.name;
  if (patch.description !== undefined) updates.description = patch.description;
  if (patch.date !== undefined) updates.date = new Date(patch.date);

  const [updated] = await db
    .update(events)
    .set(updates)
    .where(and(eq(events.id, id), isNull(events.deletedAt)))
    .returning();

  if (!updated) {
    return { ok: false, code: 'EVENT_NOT_FOUND', message: 'Event not found' };
  }

  const event = await getEventById(updated.id);
  if (!event) {
    return { ok: false, code: 'EVENT_NOT_FOUND', message: 'Event not found' };
  }

  return { ok: true, event };
}

export type AddEventPhotosResult =
  | { ok: true; photos: CreatedPhoto[] }
  | { ok: false; code: 'EVENT_NOT_FOUND'; message: string };

export async function addEventPhotos(
  eventId: number,
  photos: EventPhotoInput[],
): Promise<AddEventPhotosResult> {
  const [event] = await db
    .select({ id: events.id })
    .from(events)
    .where(and(eq(events.id, eventId), isNull(events.deletedAt)))
    .limit(1);

  if (!event) {
    return { ok: false, code: 'EVENT_NOT_FOUND', message: 'Event not found' };
  }

  const inserted = await insertPhotos(event.id, photos);
  return { ok: true, photos: inserted };
}

export type DeleteEventPhotoResult =
  | { ok: true }
  | {
      ok: false;
      code: 'EVENT_NOT_FOUND' | 'EVENT_PHOTO_NOT_FOUND' | 'EVENT_MUST_HAVE_PHOTO';
      message: string;
    };

export async function deleteEventPhoto(
  eventId: number,
  photoId: number,
): Promise<DeleteEventPhotoResult> {
  const [event] = await db
    .select({ id: events.id })
    .from(events)
    .where(and(eq(events.id, eventId), isNull(events.deletedAt)))
    .limit(1);

  if (!event) {
    return { ok: false, code: 'EVENT_NOT_FOUND', message: 'Event not found' };
  }

  const [photo] = await db
    .select({ id: eventPhotos.id, objectKey: eventPhotos.objectKey })
    .from(eventPhotos)
    .where(and(eq(eventPhotos.id, photoId), eq(eventPhotos.eventId, eventId)))
    .limit(1);

  if (!photo) {
    return { ok: false, code: 'EVENT_PHOTO_NOT_FOUND', message: 'Event photo not found' };
  }

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(eventPhotos)
    .where(eq(eventPhotos.eventId, eventId));

  if (total <= 1) {
    return {
      ok: false,
      code: 'EVENT_MUST_HAVE_PHOTO',
      message: 'Event must have at least one photo',
    };
  }

  await db.delete(eventPhotos).where(eq(eventPhotos.id, photo.id));
  await deleteObject(photo.objectKey);

  return { ok: true };
}
