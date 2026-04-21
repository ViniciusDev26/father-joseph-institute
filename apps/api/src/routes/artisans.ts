import { isNull } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { db } from '../database/connection';
import { artisans } from '../database/schema';
import { generatePresignedPutUrl, getPublicUrl } from '../lib/storage';
import {
  createArtisanBodySchema,
  createArtisanResponseSchema,
  listArtisansResponseSchema,
} from '../schemas/artisan';
import { errorResponseSchema } from '../schemas/shared';
import type { CreateArtisanBody } from '../types/artisan';

export async function artisanRoutes(app: FastifyInstance) {
  const listArtisansSchema = {
    description: 'List all artisans',
    tags: ['Artisans'],
    response: {
      200: listArtisansResponseSchema,
    },
  };

  const createArtisanSchema = {
    description: 'Register a new artisan',
    tags: ['Artisans'],
    body: createArtisanBodySchema,
    response: {
      201: createArtisanResponseSchema,
      400: errorResponseSchema,
    },
  };

  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/artisans', { schema: listArtisansSchema }, listArtisans)
    .post('/artisans', { schema: createArtisanSchema }, createArtisan);
}

async function listArtisans(_request: FastifyRequest, reply: FastifyReply) {
  const rows = await db
    .select()
    .from(artisans)
    .where(isNull(artisans.deletedAt));

  return reply.status(200).send({
    artisans: rows.map((artisan) => ({
      id: artisan.id,
      name: artisan.name,
      photoUrl: getPublicUrl(artisan.photoObjectKey),
      phone: artisan.phone ?? null,
      email: artisan.email ?? null,
      description: artisan.description ?? null,
    })),
  });
}

async function createArtisan(
  request: FastifyRequest<{ Body: CreateArtisanBody }>,
  reply: FastifyReply,
) {
  const { name, photo, phone, email, description } = request.body;

  const ext = photo.mimeType === 'image/png' ? 'png' : 'jpg';

  const [artisan] = await db
    .insert(artisans)
    .values({
      name,
      photoObjectKey: 'pending',
      photoMimeType: photo.mimeType,
      phone: phone ?? null,
      email: email ?? null,
      description: description ?? null,
    })
    .returning();

  const objectKey = `artisans/${artisan.id}.${ext}`;

  const [updated] = await db
    .update(artisans)
    .set({ photoObjectKey: objectKey })
    .returning();

  const presignedUrl = await generatePresignedPutUrl(objectKey, photo.mimeType);

  return reply.status(201).send({
    id: updated.id,
    name: updated.name,
    photoUrl: getPublicUrl(objectKey),
    presignedUrl,
    phone: updated.phone ?? null,
    email: updated.email ?? null,
    description: updated.description ?? null,
  });
}
