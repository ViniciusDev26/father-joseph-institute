import { and, eq, isNull } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../database/connection';
import { assistedPeople } from '../database/schema';
import {
  assistedPersonParamsSchema,
  createAssistedPersonBodySchema,
  createAssistedPersonResponseSchema,
  getAssistedPersonResponseSchema,
  listAssistedPeopleResponseSchema,
  updateAssistedPersonBodySchema,
  updateAssistedPersonResponseSchema,
} from '../schemas/assisted-person';
import { errorResponseSchema } from '../schemas/shared';
import type {
  AssistedPersonParams,
  CreateAssistedPersonBody,
  UpdateAssistedPersonBody,
} from '../types/assisted-person';

export async function assistedPersonRoutes(app: FastifyInstance) {
  const listAssistedPeopleSchema = {
    description: 'List all assisted people',
    tags: ['AssistedPeople'],
    response: {
      200: listAssistedPeopleResponseSchema,
      401: errorResponseSchema,
    },
  };

  const getAssistedPersonSchema = {
    description: 'Get a single assisted person by ID',
    tags: ['AssistedPeople'],
    params: assistedPersonParamsSchema,
    response: {
      200: getAssistedPersonResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  const createAssistedPersonSchema = {
    description: 'Register a new assisted person',
    tags: ['AssistedPeople'],
    body: createAssistedPersonBodySchema,
    response: {
      201: createAssistedPersonResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
    },
  };

  const updateAssistedPersonSchema = {
    description: 'Update an assisted person',
    tags: ['AssistedPeople'],
    params: assistedPersonParamsSchema,
    body: updateAssistedPersonBodySchema,
    response: {
      200: updateAssistedPersonResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  const deleteAssistedPersonSchema = {
    description: 'Soft-delete an assisted person',
    tags: ['AssistedPeople'],
    params: assistedPersonParamsSchema,
    response: {
      204: z.null(),
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/assisted-people',
      { schema: listAssistedPeopleSchema, preHandler: [app.authenticate] },
      listAssistedPeople,
    )
    .get(
      '/assisted-people/:id',
      { schema: getAssistedPersonSchema, preHandler: [app.authenticate] },
      getAssistedPerson,
    )
    .post(
      '/assisted-people',
      { schema: createAssistedPersonSchema, preHandler: [app.authenticate] },
      createAssistedPerson,
    )
    .patch(
      '/assisted-people/:id',
      { schema: updateAssistedPersonSchema, preHandler: [app.authenticate] },
      updateAssistedPerson,
    )
    .delete(
      '/assisted-people/:id',
      { schema: deleteAssistedPersonSchema, preHandler: [app.authenticate] },
      deleteAssistedPerson,
    );
}

async function listAssistedPeople(_request: FastifyRequest, reply: FastifyReply) {
  const rows = await db
    .select()
    .from(assistedPeople)
    .where(isNull(assistedPeople.deletedAt));

  return reply.status(200).send({
    assistedPeople: rows.map(person => ({
      id: person.id,
      name: person.name,
      description: person.description ?? null,
    })),
  });
}

async function getAssistedPerson(
  request: FastifyRequest<{ Params: AssistedPersonParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const [person] = await db
    .select()
    .from(assistedPeople)
    .where(and(eq(assistedPeople.id, id), isNull(assistedPeople.deletedAt)))
    .limit(1);

  if (!person) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'ASSISTED_PERSON_NOT_FOUND',
      error: 'Not Found',
      message: 'Assisted person not found',
    });
  }

  return reply.status(200).send({
    id: person.id,
    name: person.name,
    description: person.description ?? null,
  });
}

async function createAssistedPerson(
  request: FastifyRequest<{ Body: CreateAssistedPersonBody }>,
  reply: FastifyReply,
) {
  const { name, description } = request.body;

  const [person] = await db
    .insert(assistedPeople)
    .values({
      name,
      description: description ?? null,
    })
    .returning();

  return reply.status(201).send({
    id: person.id,
    name: person.name,
    description: person.description ?? null,
  });
}

async function updateAssistedPerson(
  request: FastifyRequest<{ Params: AssistedPersonParams; Body: UpdateAssistedPersonBody }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { name, description } = request.body;

  const updates: { name?: string; description?: string | null; updatedAt: Date } = {
    updatedAt: new Date(),
  };
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;

  const [updated] = await db
    .update(assistedPeople)
    .set(updates)
    .where(and(eq(assistedPeople.id, id), isNull(assistedPeople.deletedAt)))
    .returning();

  if (!updated) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'ASSISTED_PERSON_NOT_FOUND',
      error: 'Not Found',
      message: 'Assisted person not found',
    });
  }

  return reply.status(200).send({
    id: updated.id,
    name: updated.name,
    description: updated.description ?? null,
  });
}

async function deleteAssistedPerson(
  request: FastifyRequest<{ Params: AssistedPersonParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const [deleted] = await db
    .update(assistedPeople)
    .set({ deletedAt: new Date() })
    .where(and(eq(assistedPeople.id, id), isNull(assistedPeople.deletedAt)))
    .returning({ id: assistedPeople.id });

  if (!deleted) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'ASSISTED_PERSON_NOT_FOUND',
      error: 'Not Found',
      message: 'Assisted person not found',
    });
  }

  return reply.status(204).send();
}
