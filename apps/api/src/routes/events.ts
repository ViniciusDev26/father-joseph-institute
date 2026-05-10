import { randomUUID } from 'node:crypto';
import { and, count, desc, eq, isNull } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../database/connection';
import { eventPhotos, events } from '../database/schema';
import { deleteObject, generatePresignedPutUrl, getPublicUrl } from '../lib/storage';
import {
  addEventPhotosBodySchema,
  addEventPhotosResponseSchema,
  createEventBodySchema,
  createEventResponseSchema,
  eventParamsSchema,
  eventPhotoParamsSchema,
  getEventResponseSchema,
  listEventsResponseSchema,
  updateEventBodySchema,
  updateEventResponseSchema,
} from '../schemas/event';
import { errorResponseSchema } from '../schemas/shared';
import type {
  AddEventPhotosBody,
  CreateEventBody,
  EventParams,
  EventPhotoParams,
  UpdateEventBody,
} from '../types/event';

export async function eventRoutes(app: FastifyInstance) {
  const listEventsSchema = {
    description: 'List all events with their photos',
    tags: ['Events'],
    response: {
      200: listEventsResponseSchema,
    },
  };

  const getEventSchema = {
    description: 'Get a single event by ID',
    tags: ['Events'],
    params: eventParamsSchema,
    response: {
      200: getEventResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  const createEventSchema = {
    description: 'Create a new event with one or more photos',
    tags: ['Events'],
    body: createEventBodySchema,
    response: {
      201: createEventResponseSchema,
      400: errorResponseSchema,
    },
  };

  const updateEventSchema = {
    description: 'Update an event',
    tags: ['Events'],
    params: eventParamsSchema,
    body: updateEventBodySchema,
    response: {
      200: updateEventResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  const deleteEventPhotoSchema = {
    description: 'Delete a single photo from an event',
    tags: ['Events'],
    params: eventPhotoParamsSchema,
    response: {
      204: z.null(),
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  const addEventPhotosSchema = {
    description: 'Add new photos to an existing event',
    tags: ['Events'],
    params: eventParamsSchema,
    body: addEventPhotosBodySchema,
    response: {
      201: addEventPhotosResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events', { schema: listEventsSchema }, listEvents)
    .get('/events/:id', { schema: getEventSchema, preHandler: [app.authenticate] }, getEvent)
    .post(
      '/events',
      {
        schema: createEventSchema,
        preHandler: [app.authenticate],
      },
      createEvent,
    )
    .patch(
      '/events/:id',
      { schema: updateEventSchema, preHandler: [app.authenticate] },
      updateEvent,
    )
    .post(
      '/events/:id/photos',
      { schema: addEventPhotosSchema, preHandler: [app.authenticate] },
      addEventPhotos,
    )
    .delete(
      '/events/:id/photos/:photoId',
      { schema: deleteEventPhotoSchema, preHandler: [app.authenticate] },
      deleteEventPhoto,
    );
}

async function loadEventWithPhotos(eventId: number) {
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
    .where(and(eq(events.id, eventId), isNull(events.deletedAt)));

  if (rows.length === 0) return null;

  const first = rows[0];
  const photos: { id: number; url: string }[] = [];
  for (const row of rows) {
    if (row.photoId && row.objectKey) {
      photos.push({ id: row.photoId, url: getPublicUrl(row.objectKey) });
    }
  }

  return {
    id: first.id,
    name: first.name,
    description: first.description,
    date: first.date.toISOString(),
    photos,
  };
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

async function getEvent(
  request: FastifyRequest<{ Params: EventParams }>,
  reply: FastifyReply,
) {
  const event = await loadEventWithPhotos(request.params.id);

  if (!event) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'EVENT_NOT_FOUND',
      error: 'Not Found',
      message: 'Event not found',
    });
  }

  return reply.status(200).send(event);
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

async function updateEvent(
  request: FastifyRequest<{ Params: EventParams; Body: UpdateEventBody }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { name, description, date } = request.body;

  const updates: {
    name?: string;
    description?: string | null;
    date?: Date;
    updatedAt: Date;
  } = { updatedAt: new Date() };
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (date !== undefined) updates.date = new Date(date);

  const [updated] = await db
    .update(events)
    .set(updates)
    .where(and(eq(events.id, id), isNull(events.deletedAt)))
    .returning();

  if (!updated) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'EVENT_NOT_FOUND',
      error: 'Not Found',
      message: 'Event not found',
    });
  }

  const event = await loadEventWithPhotos(updated.id);
  if (!event) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'EVENT_NOT_FOUND',
      error: 'Not Found',
      message: 'Event not found',
    });
  }

  return reply.status(200).send(event);
}

async function addEventPhotos(
  request: FastifyRequest<{ Params: EventParams; Body: AddEventPhotosBody }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { photos } = request.body;

  const [event] = await db
    .select({ id: events.id })
    .from(events)
    .where(and(eq(events.id, id), isNull(events.deletedAt)))
    .limit(1);

  if (!event) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'EVENT_NOT_FOUND',
      error: 'Not Found',
      message: 'Event not found',
    });
  }

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

  return reply.status(201).send({ photos: photosResult });
}

async function deleteEventPhoto(
  request: FastifyRequest<{ Params: EventPhotoParams }>,
  reply: FastifyReply,
) {
  const { id, photoId } = request.params;

  const [event] = await db
    .select({ id: events.id })
    .from(events)
    .where(and(eq(events.id, id), isNull(events.deletedAt)))
    .limit(1);

  if (!event) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'EVENT_NOT_FOUND',
      error: 'Not Found',
      message: 'Event not found',
    });
  }

  const [photo] = await db
    .select({ id: eventPhotos.id, objectKey: eventPhotos.objectKey })
    .from(eventPhotos)
    .where(and(eq(eventPhotos.id, photoId), eq(eventPhotos.eventId, id)))
    .limit(1);

  if (!photo) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'EVENT_PHOTO_NOT_FOUND',
      error: 'Not Found',
      message: 'Event photo not found',
    });
  }

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(eventPhotos)
    .where(eq(eventPhotos.eventId, id));

  if (total <= 1) {
    return reply.status(400).send({
      statusCode: 400,
      code: 'EVENT_MUST_HAVE_PHOTO',
      error: 'Bad Request',
      message: 'Event must have at least one photo',
    });
  }

  await db.delete(eventPhotos).where(eq(eventPhotos.id, photo.id));
  await deleteObject(photo.objectKey);

  return reply.status(204).send();
}
