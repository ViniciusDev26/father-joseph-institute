import { randomUUID } from 'node:crypto';
import { desc, eq, isNull } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { db } from '../database/connection';
import { eventPhotos, events } from '../database/schema';
import { generatePresignedPutUrl, getPublicUrl } from '../lib/storage';
import {
  createEventBodySchema,
  createEventResponseSchema,
  listEventsResponseSchema,
} from '../schemas/event';
import { errorResponseSchema } from '../schemas/shared';
import type { CreateEventBody } from '../types/event';

export async function eventRoutes(app: FastifyInstance) {
  const createEventSchema = {
    description: 'Create a new event with one or more photos',
    tags: ['Events'],
    body: createEventBodySchema,
    response: {
      201: createEventResponseSchema,
      400: errorResponseSchema,
    },
  };

  const listEventsSchema = {
    description: 'List all events with their photos',
    tags: ['Events'],
    response: {
      200: listEventsResponseSchema,
    },
  };

  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events', { schema: createEventSchema }, createEvent)
    .get('/events', { schema: listEventsSchema }, listEvents);
}

async function createEvent(
  request: FastifyRequest<{ Body: CreateEventBody }>,
  reply: FastifyReply,
) {
  const { name, description, date, photos } = request.body;

  const [event] = await db
    .insert(events)
    .values({
      name,
      description: description ?? null,
      date: new Date(date),
    })
    .returning();

  const photosResult = await Promise.all(
    photos.map(async photo => {
      const ext = photo.mimeType === 'image/png' ? 'png' : 'jpg';
      const objectKey = `events/${event.id}/${randomUUID()}.${ext}`;

      const [inserted] = await db
        .insert(eventPhotos)
        .values({
          eventId: event.id,
          objectKey,
          mimeType: photo.mimeType,
        })
        .returning();

      const presignedUrl = await generatePresignedPutUrl(objectKey, photo.mimeType);

      return {
        id: inserted.id,
        url: getPublicUrl(objectKey),
        presignedUrl,
      };
    }),
  );

  return reply.status(201).send({
    id: event.id,
    name: event.name,
    description: event.description,
    date: event.date.toISOString(),
    photos: photosResult,
  });
}

async function listEvents(_request: FastifyRequest, reply: FastifyReply) {
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

  const eventsMap = new Map<
    number,
    {
      id: number;
      name: string;
      description: string | null;
      date: string;
      photos: { id: number; url: string }[];
    }
  >();

  for (const row of rows) {
    let event = eventsMap.get(row.id);

    if (!event) {
      event = {
        id: row.id,
        name: row.name,
        description: row.description,
        date: row.date.toISOString(),
        photos: [],
      };
      eventsMap.set(row.id, event);
    }

    if (row.photoId && row.objectKey) {
      event.photos.push({
        id: row.photoId,
        url: getPublicUrl(row.objectKey),
      });
    }
  }

  return reply.status(200).send({ events: [...eventsMap.values()] });
}
