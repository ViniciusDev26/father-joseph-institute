import { randomUUID } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { db } from '../database/connection';
import { eventPhotos, events } from '../database/schema';
import { generatePresignedPutUrl, getPublicUrl } from '../lib/storage';
import { createEventBodySchema, createEventResponseSchema } from '../schemas/event';

export async function eventRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events',
    {
      schema: {
        description: 'Create a new event with one or more photos',
        tags: ['Events'],
        body: createEventBodySchema,
        response: {
          201: createEventResponseSchema,
        },
      },
    },
    async (request, reply) => {
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
    },
  );
}
