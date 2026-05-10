import { and, eq, isNull } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../database/connection';
import { artisans } from '../database/schema';
import { generatePresignedPutUrl, getPublicUrl } from '../lib/storage';
import {
  artisanParamsSchema,
  createArtisanBodySchema,
  createArtisanResponseSchema,
  getArtisanResponseSchema,
  listArtisansResponseSchema,
  updateArtisanBodySchema,
  updateArtisanResponseSchema,
} from '../schemas/artisan';
import { errorResponseSchema } from '../schemas/shared';
import type { ArtisanParams, CreateArtisanBody, UpdateArtisanBody } from '../types/artisan';

export async function artisanRoutes(app: FastifyInstance) {
  const listArtisansSchema = {
    description: 'List all artisans',
    tags: ['Artisans'],
    response: {
      200: listArtisansResponseSchema,
    },
  };

  const getArtisanSchema = {
    description: 'Get a single artisan by ID',
    tags: ['Artisans'],
    params: artisanParamsSchema,
    response: {
      200: getArtisanResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
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

  const updateArtisanSchema = {
    description: 'Update an artisan',
    tags: ['Artisans'],
    params: artisanParamsSchema,
    body: updateArtisanBodySchema,
    response: {
      200: updateArtisanResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  const deleteArtisanSchema = {
    description: 'Soft-delete an artisan',
    tags: ['Artisans'],
    params: artisanParamsSchema,
    response: {
      204: z.null(),
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/artisans', { schema: listArtisansSchema }, listArtisans)
    .get('/artisans/:id', { schema: getArtisanSchema, preHandler: [app.authenticate] }, getArtisan)
    .post(
      '/artisans',
      {
        schema: createArtisanSchema,
        preHandler: [app.authenticate],
      },
      createArtisan,
    )
    .patch(
      '/artisans/:id',
      { schema: updateArtisanSchema, preHandler: [app.authenticate] },
      updateArtisan,
    )
    .delete(
      '/artisans/:id',
      { schema: deleteArtisanSchema, preHandler: [app.authenticate] },
      deleteArtisan,
    );
}

async function listArtisans(_request: FastifyRequest, reply: FastifyReply) {
  const rows = await db.select().from(artisans).where(isNull(artisans.deletedAt));

  return reply.status(200).send({
    artisans: rows.map(artisan => ({
      id: artisan.id,
      name: artisan.name,
      photoUrl: getPublicUrl(artisan.photoObjectKey),
      phone: artisan.phone ?? null,
      email: artisan.email ?? null,
      description: artisan.description ?? null,
    })),
  });
}

async function getArtisan(request: FastifyRequest<{ Params: ArtisanParams }>, reply: FastifyReply) {
  const { id } = request.params;

  const [artisan] = await db
    .select()
    .from(artisans)
    .where(and(eq(artisans.id, id), isNull(artisans.deletedAt)))
    .limit(1);

  if (!artisan) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'ARTISAN_NOT_FOUND',
      error: 'Not Found',
      message: 'Artisan not found',
    });
  }

  return reply.status(200).send({
    id: artisan.id,
    name: artisan.name,
    photoUrl: getPublicUrl(artisan.photoObjectKey),
    phone: artisan.phone ?? null,
    email: artisan.email ?? null,
    description: artisan.description ?? null,
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
    .where(eq(artisans.id, artisan.id))
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

async function updateArtisan(
  request: FastifyRequest<{ Params: ArtisanParams; Body: UpdateArtisanBody }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { name, phone, email, description } = request.body;

  const [current] = await db
    .select()
    .from(artisans)
    .where(and(eq(artisans.id, id), isNull(artisans.deletedAt)))
    .limit(1);

  if (!current) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'ARTISAN_NOT_FOUND',
      error: 'Not Found',
      message: 'Artisan not found',
    });
  }

  const nextPhone = phone === undefined ? current.phone : phone;
  const nextEmail = email === undefined ? current.email : email;

  if (nextPhone === null && nextEmail === null) {
    return reply.status(400).send({
      statusCode: 400,
      code: 'ARTISAN_CONTACT_REQUIRED',
      error: 'Bad Request',
      message: 'At least one of phone or email must remain set',
    });
  }

  const updates: {
    name?: string;
    phone?: string | null;
    email?: string | null;
    description?: string | null;
    updatedAt: Date;
  } = { updatedAt: new Date() };
  if (name !== undefined) updates.name = name;
  if (phone !== undefined) updates.phone = phone;
  if (email !== undefined) updates.email = email;
  if (description !== undefined) updates.description = description;

  const [updated] = await db
    .update(artisans)
    .set(updates)
    .where(and(eq(artisans.id, id), isNull(artisans.deletedAt)))
    .returning();

  if (!updated) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'ARTISAN_NOT_FOUND',
      error: 'Not Found',
      message: 'Artisan not found',
    });
  }

  return reply.status(200).send({
    id: updated.id,
    name: updated.name,
    photoUrl: getPublicUrl(updated.photoObjectKey),
    phone: updated.phone ?? null,
    email: updated.email ?? null,
    description: updated.description ?? null,
  });
}

async function deleteArtisan(
  request: FastifyRequest<{ Params: ArtisanParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const [deleted] = await db
    .update(artisans)
    .set({ deletedAt: new Date() })
    .where(and(eq(artisans.id, id), isNull(artisans.deletedAt)))
    .returning({ id: artisans.id });

  if (!deleted) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'ARTISAN_NOT_FOUND',
      error: 'Not Found',
      message: 'Artisan not found',
    });
  }

  return reply.status(204).send();
}
